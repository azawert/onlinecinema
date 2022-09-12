import { Body, Controller, Delete, Get, HttpCode, Param, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { Auth } from "../auth/decorators/auth.decorator";
import { User } from "./decorators/user.decorator";
import { updateUserDto } from "./dto/updateUser.dto";
import { idValidationPipe } from "../pipes/id.validation.pipe";
import { UserModel } from "./user.model";


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {
  }
  @Auth()
  @Get('profile')

  async getProfile(@User('_id')_id:string){
    return this.userService.byId(_id)
  }
  @UsePipes(new ValidationPipe())
  @Put('profile')
  @HttpCode(200)
  @Auth()

  async updateProfile(@User('_id')_id:string,@Body()dto:updateUserDto){
    return this.userService.updateUser(_id,dto)
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')

  async updateUser(@Param('id',idValidationPipe)id:string,@Body()dto:updateUserDto){
    return this.userService.updateUser(id,dto)
  }


  @Get('/count')
  @Auth('admin')
  async getCount(){
    return this.userService.getCount()
  }

  @UsePipes(new ValidationPipe())
  @Delete('/:id')
  @Auth('admin')

  async deleteUser(@Param('id',idValidationPipe)id:string){
    return this.userService.deleteUser(id)
  }
  @UsePipes(new ValidationPipe())
  @Get('/')
  @Auth('admin')
  async getAllUsers(@Query('searchTerm')searchTerm?:string){
    return this.userService.getAllUsers(searchTerm)
  }
  @UsePipes(new ValidationPipe())
  @Get('/:id')
  @Auth('admin')
  async getASingleUser(@Param('id',idValidationPipe)id:string){
    return this.userService.getUserProfile(id)
  }
}
