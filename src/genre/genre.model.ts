import {Base, TimeStamps} from "@typegoose/typegoose/lib/defaultClasses";
import {prop} from "@typegoose/typegoose";

export interface  GenreModel extends Base{}
export class GenreModel extends TimeStamps {
    @prop()
    name:string
    @prop()
    slug:string
    @prop()
    description:string
    @prop()
    icon:string

}