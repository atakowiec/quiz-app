import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from "./user.model";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDetails } from "@shared/user";
import { TokenPayload } from "../auth/auth";
import { UpdateUserDto } from "./user";
import * as bcrypt from "bcrypt";
import { EventEmitter2 } from "@nestjs/event-emitter";


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    public readonly repository: Repository<User>,
    public readonly eventEmitter: EventEmitter2
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

    return {
      id: user.id,
      username: user.username,
      iconColor: user.iconColor,
    }
  }

  async findUsers(user: TokenPayload, query: string): Promise<UserDetails[]> {
    const found = await this.repository
      .createQueryBuilder('user')
      .where("user.username LIKE :query", { query: `%${query}%` })
      .andWhere("user.id != :id", { id: user.id })
      .limit(20)
      .getMany();

    return found.map(user => ({
      id: user.id,
      username: user.username,
      iconColor: user.iconColor
    }));
  }

  async updateProfile(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }

    if (updateUserDto.password && updateUserDto.currentPassword) {
      const isMatch = await bcrypt.compare(updateUserDto.currentPassword, user.password);
      if (!isMatch) {
        throw new BadRequestException("Obecne hasło jest niepoprawne");
      }
      user.password = await this.hashPassword(updateUserDto.password);
    } else if (updateUserDto.password && !updateUserDto.currentPassword) {
      throw new BadRequestException("Proszę podać obecne hasło");
    }

    await this.repository.save(user);
    return user;
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async changeColor(userId: number, color: string) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`Ten użytkownik nie istnieje`);
    }

    user.iconColor = color;

    await this.repository.save(user);

    this.eventEmitter.emit("user.icon_changed", user, color);
  }
}
