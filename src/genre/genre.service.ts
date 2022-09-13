import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ModelType} from "@typegoose/typegoose/lib/types";
import { GenreModel } from './genre.model';
import {CreateGenreDto} from "./dto/createGenre.dto";


@Injectable()
export class GenreService {
    constructor(@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>) {
    }


    async findBySlug(slug: string) {
        const genre = await this.GenreModel.findOne({slug}).exec()
        if(!genre)
            throw new NotFoundException('Жанр не найден')
        return genre
    }

    async getAllGenres(searchTerm?:string){
        let options = {}
        if(searchTerm)
            options = {
                $or: [
                    {
                        name: new RegExp(searchTerm,'i')
                    },
                    {
                        slug: new RegExp(searchTerm,'i')
                    },
                    {
                        description: new RegExp(searchTerm,'i')
                    }
                ]
            }
        return  this.GenreModel.find({searchTerm}).select( '-updatedAt -__v').sort({
            createdAt: 'desc'
        })

    }

    async getCollections() {
        // const genres = await this.getAll()
        // const collections = genres
        // return collections
    }

    // ADMIN RIGHTS BELOW
    async byIdGenre(_id:string){
        const genre = await this.GenreModel.findById(_id)
        if(!genre)
            throw new NotFoundException('Жанр не найден.')
        return genre
    }

    async updateGenre(_id:string,dto: CreateGenreDto) {
        const ifGenreExists = await this.GenreModel.findById({_id})
        if(!ifGenreExists){
            throw new NotFoundException('Такого жанра не существует.')
        }
        return this.GenreModel.findByIdAndUpdate(_id,dto,{
            new: true
        }).exec()
    }

    async deleteGenre(_id:string){
        const deletedGenre = await this.GenreModel.findByIdAndDelete({_id}).exec()
        if(!deletedGenre){
            throw new BadRequestException('Жанр не найден')
        }
        return {message:'Удаление произошло успешно!'}
    }

    async createGenre(){
        const defValue = {
            name:"",
            slug:"",
            icon:"",
            description:"",
        }

        const genre = await this.GenreModel.create(defValue)
        return genre._id
    }

}
