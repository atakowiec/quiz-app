import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Friend } from "@shared/friends";
import { FriendsService } from "./friends.service";
import { Request } from "../app";
import { AuthGuard } from "../guards/auth.guard";

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {
    // empty
  }

  @Get()
  @UseGuards(AuthGuard)
  async getFriends(@Req() req: Request): Promise<Friend[]> {
    return await this.friendsService.getFriends(req.user);
  }
}
