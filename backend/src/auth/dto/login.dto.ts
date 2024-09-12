import { IsNotEmpty } from "class-validator";

export class LoginDto {
  @IsNotEmpty({ message: "Proszę wprowadzić login" })
  username: string;

  @IsNotEmpty({ message: "Proszę wprowadzić hasło" })
  password: string;
}
