import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { prop, Ref } from "@typegoose/typegoose";
import { IsArray, IsBoolean, IsString } from "class-validator";
import { ActorModel } from "../actor/actor.model";
import { GenreModel } from "../genre/genre.model";

export interface MovieModel extends Base{}

export class Parametrs {
  @prop()
  year:number

  @prop()
  duration:number

  @prop()
  country:number
}

export class MovieModel extends TimeStamps{
  @prop()
  poster:string

  @prop()
  bigPoster:string

  @prop({unique:true})
  slug: string



  @prop({default: 4.0})
  rating?:number

  @prop({default:0})
  countOpened?:number

  @prop()
  parametrs?: Parametrs

  @prop()
  videoUrl: string


  @prop({ref: ()=> GenreModel})
  genres:Ref<GenreModel>[]


  @prop({ref: () => ActorModel})
  actors:Ref<ActorModel>[]

  @prop({default:false})
  isSendTelegram?:boolean
}