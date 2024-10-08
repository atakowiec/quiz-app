import { Controller, Get, Header, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from "./user.service";
import { Request } from "../app";
import { AuthGuard } from "../guards/auth.guard";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {
    // empty
  }

  @Get(":id")
  @Header('Cache-Control', 'none')
  @UseGuards(AuthGuard)
  getUserDataById(@Req() req: Request, @Param('id') id: number) {
    return this.userService.getUserDataById(req.user, id);
  }
}
