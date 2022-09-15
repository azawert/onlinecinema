import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { MovieService } from "./movie.service";
import { idValidationPipe } from "../pipes/id.validation.pipe";
import { Types } from "mongoose";
import { Auth } from "../auth/decorators/auth.decorator";
import { MovieDto } from "./dto/createMovie.dto";
import { GenreIdsDto } from "./dto/genreIds.dto";
import { SlugDto } from "./dto/slug.dto";

@Controller('movie')
export class MovieController {
  constructor(private readonly MovieService:MovieService) {
  }

  @Get('/by-slug/:slug')
  async getBySlug(@Param('slug')slug:SlugDto) {
    return this.MovieService.getMovieBySlug(slug)
  }
  @Get('/by-actor/:actorId')
  async getByActor(@Param('actorId',idValidationPipe)actorId:Types.ObjectId) {
    return this.MovieService.getMovieByActor(actorId)
  }
  @UsePipes(new ValidationPipe())
  @Post('/by-genres')
  @HttpCode(200)
  async getByGenres(@Body('genres')genresIds:Types.ObjectId[]) {
    return this.MovieService.getMovieByGenres(genresIds)
  }
  @Get('')
  async getAllMovies(@Query('searchTerm')searchTerm?:string){
    return this.MovieService.getAllMovies(searchTerm)
  }
  @Get('/popular')
  async getPopularMovies(){
    return this.MovieService.getMostPopular()
  }
  @Put('/update-views')
  @HttpCode(200)
  async updateViews(@Body('slug')slug:SlugDto) {
    return this.MovieService.upadteViewsCount(slug)
  }

  //admin endpoints

  @Get(':id')
  @Auth('admin')
  async getById(@Param('id',idValidationPipe)id:string){
    return this.MovieService.getMovieById(id)
  }

  @Post('/create-new-movie')
  @HttpCode(200)
  @Auth('admin')
  async createNewMovie() {
    return this.MovieService.createNewMovie()
  }

  @UsePipes(new ValidationPipe())
  @Put('/:id')
  @HttpCode(200)
  @Auth('admin')
  async updateMovie(@Param('id',idValidationPipe)id:string,@Body()dto:MovieDto) {
    return this.MovieService.updateMovie(id,dto)
  }
  @Delete('/:id')
  @HttpCode(200)
  @Auth('admin')
  async deleteMovie(@Param('id',idValidationPipe)id:string){
    return this.MovieService.deleteMovie(id)
  }
}
