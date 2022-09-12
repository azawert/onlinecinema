import { IsString } from "class-validator";

export class RefreshTokenDto {
  @IsString({
    message:"No refresh token or not a string"
  })
  refreshToken: string
}