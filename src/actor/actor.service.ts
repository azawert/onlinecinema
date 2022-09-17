import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ActorModel} from "./actor.model";
import {ModelType} from "@typegoose/typegoose/lib/types";
import {ActorDto} from "./dto/actor.dto";


@Injectable()
export class ActorService {
    constructor(@InjectModel(ActorModel) private readonly  ActorModel: ModelType<ActorModel>) {}

    async getActorBySlug(slug:string) {
        const actor = await this.ActorModel.findOne({slug})
        if(!actor)
            throw new NotFoundException('Актер не найден!')
        return actor
    }
    async getAllActors(searchTerm?:string){
        let options = {}
        if(searchTerm){
            options = {
                $or: [
                    {
                        name: new RegExp(searchTerm,'i')
                    },
                    {
                        slug: new RegExp(searchTerm,'i')
                    }
                ]
            }
        }
        const actor = await this.ActorModel.find(options)
        if(!actor)
            throw new NotFoundException('По вашему запросу актер не был найден')
        return this.ActorModel.aggregate().match(options).lookup({ from: 'Movie',
        foreignField:'actors',localField:'_id',as:'movies'}).addFields({countMovies:{$size:'$movies'}}).project({__v:0,updatedAt:0,movies:0}).sort({createdAt:'desc'}).exec()
    }
    async getActorById(_id:string) {
        const actor = await this.ActorModel.findById({_id})
        if(!actor){
            throw new NotFoundException('Актер не был найден')
        }
        return this.ActorModel.findById({_id}).select('-__v -updatedAt')
    }
    async createActor() {
        const defValue: ActorDto = {
            name:'',
            slug:'',
            photo:'',
        }
        const actor = await this.ActorModel.create(defValue)
        return actor._id
    }
    async updateActor(_id:string,dto:ActorDto) {
        const actor = await this.ActorModel.findById(_id)
        if(!actor)
            throw new NotFoundException('Актер не найден'
            )
        if(!dto.photo || !dto.name|| !dto.slug) {
            throw new BadRequestException('Заполните все поля')
        }
        actor.name = dto.name
        actor.slug = dto.slug
        actor.photo = dto.photo

        return actor.save()
    }
    async deleteActor(_id:string){
        const actor = await this.ActorModel.findById(_id)
        if(!actor)
            throw new NotFoundException('Актер не найден')
        return this.ActorModel.findOneAndDelete(actor._id)
    }
}
