import { IsNotEmpty, IsString } from "class-validator";

export class SetNicknameDto {
  @IsNotEmpty()
  @IsString()
  nickname: string;
}
