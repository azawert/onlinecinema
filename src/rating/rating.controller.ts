import { Body, Controller, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { RatingService } from "./rating.service";
import { User } from "../user/decorators/user.decorator";
import { Types } from "mongoose";
import { Auth } from "../auth/decorators/auth.decorator";
import { RatingDto } from "./dto/rating.dto";
import { idValidationPipe } from "../pipes/id.validation.pipe";

@Controller('ratings')
export class RatingController {
  constructor(private readonly RatingService:RatingService) {
  }

  @Get('/:movieId')
  @Auth()
  async getRating(@Param('movieId',idValidationPipe)movieId:Types.ObjectId,@User('_id')userId:Types.ObjectId){

    return this.RatingService.getMovieByUser(movieId,userId)
  }

  @UsePipes(new ValidationPipe())
  @Post('setrating')
  @HttpCode(200)
  @Auth()
  async updateRating(@User('_id')_id:Types.ObjectId,@Body()dto:RatingDto) {

    return this.RatingService.setRating(_id,dto)
  }
}
