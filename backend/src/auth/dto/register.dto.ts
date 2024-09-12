import { IsNotEmpty } from "class-validator";

export class RegisterDto {
  @IsNotEmpty({ message: "Please enter your email" })
  email: string;

  @IsNotEmpty({ message: "Please enter your username" })
  username: string;

  @IsNotEmpty({ message: "Please enter your password" })
  password: string;
}
