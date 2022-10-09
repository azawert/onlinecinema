import { BadRequestException, HttpCode, Injectable, Res, UnauthorizedException } from "@nestjs/common";
import { ModelType } from "@typegoose/typegoose/lib/types";
import {InjectModel} from "nestjs-typegoose";
import {hash,genSalt,compare} from 'bcryptjs'

import { AuthDto } from "./dto/auth.dto";
import { UserModel } from "../user/user.model";
import { JwtService } from "@nestjs/jwt";
import { RefreshTokenDto } from "./dto/refreshToken.dto";

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,private readonly JwtService: JwtService) {}
  async register(dto:AuthDto){
    const existedUser = await this.UserModel.findOne({email: dto.email})
    if(existedUser)
      throw new BadRequestException('Юзер с такой почтой уже зарегестрирован')

    const salt = await genSalt(10)
    const newUser = await this.UserModel.create({
      email:dto.email,
      password:await hash(dto.password,salt)
    })
    const tokens = await this.issueToken(String(newUser._id))
    return {
      user: this.returnUserFields(newUser),
      ...tokens
    }

  }
  async login(dto:AuthDto) {
    const user = await this.validateUser(dto)

    const tokens = await this.issueToken(String(user._id))
    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }

  async getNewTokens({ refreshToken }:RefreshTokenDto) {
    if(!refreshToken)
      throw new UnauthorizedException('Token expired,login again')

    const result = await this.JwtService.verifyAsync(refreshToken)
    if(!result) throw new UnauthorizedException('Invalid token or expired')
    const user = await this.UserModel.findById(result._id)
    const tokens = await this.issueToken(String(user._id))
    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }
  async validateUser(dto:AuthDto):Promise<UserModel>{
    const existedUser = await this.UserModel.findOne({email:dto.email})
    if(!existedUser) {
      throw new BadRequestException('Неверный емейл')
    }
    const isPasswordValid = await compare(dto.password,existedUser.password)
    if(!existedUser || !isPasswordValid)
      throw new BadRequestException('Неверные данные')

    return existedUser
  }
  async issueToken(userId:string) {
    const data ={_id: userId}
    const refreshToken = await this.JwtService.signAsync(data,{
      expiresIn: '15d'
    })
    const accessToken = await this.JwtService.signAsync(data,{
      expiresIn: '1h'
    })
    return {refreshToken,accessToken}
  }
  returnUserFields(user:UserModel) {
    return {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    }
  }
}
