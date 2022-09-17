import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { TypegooseModule } from "nestjs-typegoose";
import { RatingModel } from "./rating.model";
import { MovieModule } from "../movie/movie.module";


@Module({
  controllers: [RatingController],
  providers: [RatingService],
  imports: [MovieModule,
    TypegooseModule.forFeature([{
      typegooseClass:RatingModel,
      schemaOptions: {
        collection: 'Rating'
      },
    }])
  ],
  exports:[RatingService]
})
export class RatingModule {}
