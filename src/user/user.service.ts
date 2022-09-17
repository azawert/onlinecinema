import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { UserModel } from "./user.model";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { updateUserDto } from "./dto/updateUser.dto";
import { genSalt, hash } from "bcryptjs";
import {Types} from "mongoose";



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

  async toggleFavorite(movieId: Types.ObjectId, user: UserModel) {
    const {favorites,_id} = user
    console.log(favorites)
       return this.UserModel.findByIdAndUpdate(_id, {
         favorites: favorites.includes(movieId)
           ? favorites.filter((id) => String(id) !== String(movieId))
           : [...favorites, movieId]
       },{new:true})

    }



  async getFavMovies(_id:Types.ObjectId) {
    return this.UserModel
      .findById(_id, 'favorites')
      .populate({
        path: 'favorites',
        populate: {
          path: 'genres',

        },

      })
      .exec()
      .then((data) => {
        return data.favorites
      })
  }
}

// import { Injectable, NotFoundException } from '@nestjs/common'
// import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types'
// import { genSalt, hash } from 'bcryptjs'
// import { Types } from 'mongoose'
// import { InjectModel } from 'nestjs-typegoose'
// import { updateUserDto } from './dto/updateUser.dto'
// import { UserModel } from './user.model'
//
// @Injectable()
// export class UserService {
//   constructor(
//     @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>
//   ) {}
//
//   async byId(id: string): Promise<DocumentType<UserModel>> {
//     const user = await this.userModel.findById(id).exec()
//
//     if (user) return user
//     throw new NotFoundException('User not found')
//   }
//
//   async updateProfile(_id: string, data: updateUserDto) {
//     const user = await this.userModel.findById(_id)
//     const isSameUser = await this.userModel.findOne({ email: data.email })
//
//     if (isSameUser && String(_id) !== String(isSameUser._id)) {
//       throw new NotFoundException('Email busy')
//     }
//
//     if (user) {
//       if (data.password) {
//         const salt = await genSalt(10)
//         user.password = await hash(data.password, salt)
//       }
//       user.email = data.email
//       if (data.isAdmin || data.isAdmin === false) user.isAdmin = data.isAdmin
//
//       await user.save()
//       return
//     }
//
//     throw new NotFoundException('User not found')
//   }
//
//   async getFavoriteMovies(_id: string) {
//     return this.userModel
//       .findById(_id, 'favorites')
//       .populate({
//         path: 'favorites',
//         populate: {
//           path: 'genres',
//         },
//       })
//       .exec()
//       .then((data) => {
//         return data.favorites
//       })
//   }
//
//   async toggleFavorite(movieId: Types.ObjectId, user: UserModel) {
//     const { favorites, _id } = user
//
//     await this.userModel.findByIdAndUpdate(_id, {
//       favorites: favorites.includes(movieId)
//         ? favorites.filter((id) => String(id) !== String(movieId))
//         : [...favorites, movieId],
//     })
//   }
//
//   async getCount() {
//     return this.userModel.find().count().exec()
//   }
//
//   async getAll(searchTerm?: string): Promise<DocumentType<UserModel>[]> {
//     let options = {}
//
//     if (searchTerm) {
//       options = {
//         $or: [
//           {
//             email: new RegExp(searchTerm, 'i'),
//           },
//         ],
//       }
//     }
//
//     return this.userModel
//       .find(options)
//       .select('-password -updatedAt -__v')
//       .sort({ createdAt: 'desc' })
//       .exec()
//   }
//
//   async delete(id: string): Promise<DocumentType<UserModel> | null> {
//     return this.userModel.findByIdAndDelete(id).exec()
//   }
// }
