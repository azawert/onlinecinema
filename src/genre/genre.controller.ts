import {Body, Controller, Get, Param, Query} from '@nestjs/common';
import {GenreService} from "./genre.service";
import {Auth} from "../auth/decorators/auth.decorator";
import {idValidationPipe} from "../pipes/id.validation.pipe";

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
    @Get(':id')
    @Auth('admin')
    async getGenreById(@Param('id',idValidationPipe)id:string){
        return this.genreService.byIdGenre(id)
    }

}
