import { Injectable } from '@nestjs/common';
import { User } from "./user.model";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasicUserDetails, UserDetails } from "@shared/user";
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

  async getUserDataById(id: number): Promise<UserDetails> {
    const user = await this.repository.findOne({
      where: { id }
    });

    if (!user) {
      return null;
    }

    // todo implement hardcoded data
    return {
      id: user.id,
      username: user.username,
      stats: {
        playedGames: 0,
        firstPlace: 0,
        secondPlace: 0,
        thirdPlace: 0
      }
    }
  }

  async findUsers(user: TokenPayload, query: string): Promise<BasicUserDetails[]> {
    const found = await this.repository
      .createQueryBuilder('user')
      .where("user.username LIKE :query", { query: `%${query}%` })
      .andWhere("user.id != :id", { id: user.id })
      .limit(20)
      .getMany();

    return found.map(user => ({
      id: user.id,
      username: user.username,
    }));
  }
}
