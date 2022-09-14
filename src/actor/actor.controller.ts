import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query} from '@nestjs/common';

import {Auth} from "../auth/decorators/auth.decorator";
import {idValidationPipe} from "../pipes/id.validation.pipe";

import {ActorService} from "./actor.service";
import {ActorDto} from "./dto/actor.dto";

@Controller('actors')
export class ActorController {
    constructor(private readonly  actorService: ActorService) {
    }
    @Get('by-slug/:slug')

    async getActorBySlug(@Param('slug')slug:string){
        return this.actorService.getActorBySlug(slug)
    }

    @Get('')
    async getAllActors(@Query('searchTerm')searchTerm:string){
        return this.actorService.getAllActors(searchTerm)
    }
    //admin rights
    @Get(':id')
    @Auth('admin')
    async getActorById(@Param('id',idValidationPipe)id:string){
        return this.actorService.getActorById(id)
    }
    @Delete(':id')
    @Auth('admin')
    async deleteActorById(@Param('id',idValidationPipe)id:string){
        return this.actorService.deleteActor(id)
    }
    @Post('create')
    @HttpCode(200)
    @Auth('admin')
    async createActor(){
        return this.actorService.createActor()
    }
    @Put(':id')
    @HttpCode(200)
    @Auth('admin')
    async updateActorById(@Param('id',idValidationPipe)id:string,@Body()dto:ActorDto){
        return this.actorService.updateActor(id,dto)
    }
}
