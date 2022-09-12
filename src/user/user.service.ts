import { BadGatewayException, BadRequestException,  Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { UserModel } from "./user.model";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { updateUserDto } from "./dto/updateUser.dto";
import { genSalt, hash } from "bcryptjs";


@Injectable()
export class UserService {
  constructor(@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>) {
  }

  async byId(_id:string){
    const user = await this.UserModel.findById(_id)
    if(!user)
      throw new NotFoundException('Пользователь не найден.')
    return user
  }
  async updateUser(_id:string,dto: updateUserDto) {
    const user = await this.byId(_id)

    const isEmailTaken = await this.UserModel.findOne({email:dto.email})
    if(isEmailTaken && String(isEmailTaken._id) !== _id)
      throw new BadRequestException('Данная почта уже используется')
    if(dto.password) {
      const salt = await genSalt(10)
      user.password = await hash(dto.password,salt)
    }
    user.email = dto.email
    if(dto.isAdmin || !dto.isAdmin) {
      user.isAdmin = dto.isAdmin
    }
    await user.save()
    return {message:'Информация изменена успешно!'}
  }
  async getCount(){
    return this.UserModel.find({}).count().exec()
  }
  async deleteUser(_id:string){
    const deletedUser = await this.UserModel.findByIdAndDelete({_id}).exec()
    if(!deletedUser){
      throw new BadRequestException('Пользователь не найден')
    }
    return {message:'Удаление произошло успешно!'}
  }
  async getAllUsers(searchTerm?:string){
    let options = {}
    if(searchTerm)
      options = {
      $or: [
        {
          email: new RegExp(searchTerm,'i')
        }
      ]
      }
    return  this.UserModel.find({searchTerm}).select('-password -updatedAt -__v').sort({
      createdAt: 'desc'
    })

  }
  async getUserProfile(_id:string){
    const findUser = await this.UserModel.findById({_id})
    if(!findUser)
      throw new NotFoundException('Пользователь не найден')
    return findUser
  }

}
