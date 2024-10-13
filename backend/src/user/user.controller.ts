import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from "./user.service";
import { Request } from "../app";
import { AuthGuard } from "../guards/auth.guard";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {
    // empty
  }

  @Get("/find-by-name/:query?")
  @UseGuards(AuthGuard)
  async findUsers(@Req() req: Request, @Param('query') query: string = "") {
    return await this.userService.findUsers(req.user, query);
  }

  @Get("/get-by-id/:id")
  @UseGuards(AuthGuard)
  async getUserDataById(@Param('id') id: number) {
    return await this.userService.getUserDataById(id);
  }
}
