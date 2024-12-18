import { Body, Controller, HttpCode, Post, Req, Res } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { Request } from "../app";
import { LoginDto } from "./dto/login.dto";
import { UserPacket } from "@shared/user";
import { SetUsernameDto } from "./dto/set-username.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {
    // empty
  }

  @Post("register")
  async register(
    @Body() createUserDto: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserPacket> {
    return await this.authService.register(createUserDto, res);
  }

  @Post("login")
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserPacket> {
    return await this.authService.login(loginDto, res);
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Post("verify")
  verify(@Req() req: Request) {
    return this.authService.verify(req);
  }

  @Post("username")
  @HttpCode(200)
  async setUsername(
    @Body() { username }: SetUsernameDto,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.setUsername(username, response);
  }
}
