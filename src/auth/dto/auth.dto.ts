import { IsEmail, IsString, Length } from "class-validator";

export class AuthDto {
  @IsEmail()
  email: string
  @Length(5,25,{
    message:'Пароль должен быть не меньше 5 или больше 25 символов'
  })
  @IsString()
  password: string
}