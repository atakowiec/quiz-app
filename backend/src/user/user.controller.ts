import { Controller, Get, Header, Param } from '@nestjs/common';
import { UserService } from "./user.service";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {
    // empty
  }

  @Get(":id")
  @Header('Cache-Control', 'none')
  getUserDataById(@Param('id') id: number) {
    return this.userService.getUserDataById(id);
  }
}
