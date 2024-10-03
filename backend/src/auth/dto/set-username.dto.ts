import { IsNotEmpty, IsString } from "class-validator";

export class SetUsernameDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}
