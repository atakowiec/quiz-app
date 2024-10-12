import { Injectable } from '@nestjs/common';
import { User } from "./user.model";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendshipStatus, UserDetails } from "@shared/user";
import { GameService } from "../game/services/game.service";
import { FriendsService } from "../friends/friends.service";
import { TokenPayload } from "../auth/auth";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    public readonly repository: Repository<User>,
    public readonly gameService: GameService,
    public readonly friendsService: FriendsService
  ) {
    // empty
  }

  async getUserById(id: number): Promise<User> {
    return this.repository.findOne({
      where: { id }
    });
  }

  async getUserDataById(requester: TokenPayload, id: number): Promise<UserDetails> {
    const user = await this.repository.findOne({
      where: { id }
    });

    if(!user) {
      return null;
    }

    // determine user status
    const connected = this.gameService.isUsernameConnected(user.username);
    const inGame = !!this.gameService.getGameByUsername(user.username);

    // determine friendship status
    const friendship = await this.friendsService.getFriendship(requester.id, id);
    const friendRequest = await this.friendsService.getFriendRequest(requester.id, id);
    let friendshipStatus: FriendshipStatus = "none";
    if(friendship) {
      friendshipStatus = "friend";
    } else if(friendRequest) {
      friendshipStatus = friendRequest.inviter.id === requester.id ? "requested" : "pending";
    }

    // todo implement hardcoded data
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      status: !connected ? "offline" : inGame ? "ingame" : "online",
      friendship: {
        status: friendshipStatus,
        since: friendship?.since
      },
      stats: {
        playedGames: 0,
        firstPlace: 0,
        secondPlace: 0,
        thirdPlace: 0
      }
    }
  }
}
