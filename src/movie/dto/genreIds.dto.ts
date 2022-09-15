import { IsNotEmpty, MinLength } from "class-validator";
import { Types } from "mongoose";

export class GenreIdsDto {
  @IsNotEmpty()
  @MinLength(23,{each:true})
  genres: Types.ObjectId[]
}