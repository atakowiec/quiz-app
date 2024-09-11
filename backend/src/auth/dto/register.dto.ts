import {IsNotEmpty} from "class-validator";

export class RegisterDto {
  @IsNotEmpty({message: "Proszę wprowadzić email"})
  email: string;

  @IsNotEmpty({message: "Proszę wprowadzić login"})
  username: string;

  @IsNotEmpty({message: "Proszę wprowadzić hasło"})
  password: string;
}