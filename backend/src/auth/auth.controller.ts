import {Body, Controller, Post, Res} from '@nestjs/common';
import {RegisterDto} from "./dto/register.dto";
import {AuthService} from "./auth.service";
import {Response} from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {
    // empty
  }

  @Post('register')
  async register(@Body() createUserDto: RegisterDto, @Res({passthrough: true}) res: Response) {
    return await this.authService.register(createUserDto, res);
  }

  @Post('login')
  async login(@Body() createUserDto: RegisterDto, @Res({passthrough: true}) res: Response) {
    // todo
    return createUserDto;
  }

  @Post('logout')
  logout(@Res({passthrough: true}) res: Response) {
    // todo
    return {};
  }

  @Post('verify')
  verify() {
    // todo
    return {};
  }
}
