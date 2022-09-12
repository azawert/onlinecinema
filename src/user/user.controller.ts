import { Body, Controller, Get, HttpCode, Param, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { Auth } from "../auth/decorators/auth.decorator";
import { User } from "./decorators/user.decorator";
import { updateUserDto } from "./dto/updateUser.dto";
import { idValidationPipe } from "../pipes/id.validation.pipe";


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
}
