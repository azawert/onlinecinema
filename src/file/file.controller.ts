import {
  Controller,
  HttpCode,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { FileService } from "./file.service";
import { Auth } from "../auth/decorators/auth.decorator";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('files')
export class FileController {
  constructor(private readonly  fileService:FileService) {

  }
  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth('admin')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFiles(@UploadedFile() file: Express.Multer.File, @Query('folder')folder?:string) {
    return this.fileService.saveFiles([file],folder)
  }
}
