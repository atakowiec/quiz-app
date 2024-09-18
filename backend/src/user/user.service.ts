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
}
