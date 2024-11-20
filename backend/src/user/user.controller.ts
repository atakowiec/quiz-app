import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from "./user.service";
import { Request } from "../app";
import { AuthGuard } from "../guards/auth.guard";
import { UpdateUserDto } from "./user";

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
  async getUserDataById(@Param('id') id: number) {
    return await this.userService.getUserDataById(id);
  }

  @Patch("/update-profile")
  @UseGuards(AuthGuard)
  async updateProfile(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.id;
    return await this.userService.updateProfile(userId, updateUserDto);
  }

  @Post("/change-color")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async changeColor(@Req() req: Request, @Body() color: { color: string }) {
    const userId = req.user.id;
    return await this.userService.changeColor(userId, color.color);
  }
}
