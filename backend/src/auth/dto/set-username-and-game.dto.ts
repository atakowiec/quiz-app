import { IsNotEmpty, IsString } from "class-validator";

export class SetUsernameAndGameDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  gameId: string;
}
