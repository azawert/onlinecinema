import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { MovieModel } from "./movie.model";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { MovieDto } from "./dto/createMovie.dto";
import { Types } from "mongoose";

@Injectable()
export class MovieService {
  constructor(@InjectModel(MovieModel) private  readonly  MovieModel: ModelType<MovieModel>) {
  }

  async getMovieBySlug(slug:string) {
    const movie = await this.MovieModel.findOne({slug}).populate('actors genres').exec()
    if(!movie) throw new NotFoundException('Фильм не  найден, попробуйте ввести другое название')
    return movie
  }
  async getMovieByActor(actorId:Types.ObjectId) {
    const movie = await this.MovieModel.find({actors: actorId}).exec()
    if(!movie) throw new NotFoundException('Фильм не  найден, попробуйте ввести другого актера')
    return movie
  }
  async getMovieByGenres(genreIds:Types.ObjectId[]) {
    const movie = await this.MovieModel.find({genres:{$in: genreIds}}).exec()
    if(!movie) throw new NotFoundException('Фильм не  найден')
    return movie
  }
  async upadteViewsCount(slug:string) {
    const updatedFilm = await this.MovieModel.findOneAndUpdate({slug},{
      $inc:{countOpened:1}
    }).exec()
    if(!updatedFilm) throw new BadGatewayException('Что-то пошло не так...')
    return updatedFilm
  }

  async getAllMovies(searchTerm?:string){
    let options = {}
    if(searchTerm)
      options = {
        $or: [
          {
            slug: new RegExp(searchTerm,'i')
          },
          {
            title: new RegExp(searchTerm,'i')
          }
        ]
      }
    return this.MovieModel.find(options).select('-updatedAt -__v').sort({createdAt: "desc"}).populate('actors genres').exec()
  }

  async getMostPopular() {
    return this.MovieModel.find({countOpened: {$gt:0}}).sort({countOpened:-1}).populate('genres').exec()
  }

  //admin

  async getMovieById(_id:string) {
    const movie = await this.MovieModel.findById({_id})
    if(!movie) throw new NotFoundException('Фильм не  найден.')
    return movie
  }

  async createNewMovie() {
    const defVal: MovieDto = {
      bigPoster: '',
      actors: [],
      genres:[],

      poster: '',
      title: '',
      videoUrl:'',
      slug:''
    }
    const createdMovie = await this.MovieModel.create(defVal)
    return createdMovie._id
  }

  async updateMovie(_id:string, dto:MovieDto) {
    // telegram notification


    const updateMovie = await this.MovieModel.findByIdAndUpdate(_id,dto,{
      new:true,
    }).exec()

    if(!updateMovie) throw new NotFoundException('Фильм не найден')

    return this.MovieModel.findByIdAndUpdate(_id, dto, { new: true }).exec()
  }
  async deleteMovie(_id:string) {
    const movie = await this.MovieModel.findByIdAndDelete({_id})
    if(!movie) throw new NotFoundException('Фильм не найден')

    return {message:'Фильм был успешно удален!'}
  }

}
