import { Injectable } from '@nestjs/common';
import { User } from "./user.model";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    public readonly repository: Repository<User>
  ) {
    // empty
  }

  async getUserDataById(id: number) {
    const user = await this.repository.findOne({
      where: { id }
    });

    if(!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
    }

    // todo return more extensive user data for the profile modal
  }
}
