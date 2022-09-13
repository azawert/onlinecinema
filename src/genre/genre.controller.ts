import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from "@nestjs/common";
import {GenreService} from "./genre.service";
import {Auth} from "../auth/decorators/auth.decorator";
import {idValidationPipe} from "../pipes/id.validation.pipe";
import { CreateGenreDto } from "./dto/createGenre.dto";

@Controller('genre')
export class GenreController {
    constructor(private readonly  genreService: GenreService) {
    }
    @Get('by-slug/:slug')

    async getGenreBySlug(@Param('slug')slug:string){
        return this.genreService.findBySlug(slug)
    }
    @Get('collections')
    async getCollections(){
        return this.genreService.getCollections()
    }
    @Get('')
    async getAllGenres(@Query('searchTerm')searchTerm:string){
        return this.genreService.getAllGenres(searchTerm)
    }
    //admin rights
    @Get(':id')
    @Auth('admin')
    async getGenreById(@Param('id',idValidationPipe)id:string){
        return this.genreService.byIdGenre(id)
    }
    @Delete(':id')
    @Auth('admin')
    async deleteGenreById(@Param('id',idValidationPipe)id:string){
        return this.genreService.deleteGenre(id)
    }
    @Post('create')
    @HttpCode(200)
    @Auth('admin')
    async createGenre(@Body()dto:CreateGenreDto){
        return this.genreService.createGenre(dto)
    }
    @Put(':id')
    @HttpCode(200)
    @Auth('admin')
    async updateGenreById(@Param('id',idValidationPipe)id:string,@Body()dto:CreateGenreDto){
        return this.genreService.updateGenre(id,dto)
    }

}
