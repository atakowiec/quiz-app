import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Friendship } from "./model/friendship.model";
import { FriendRequest } from "./model/friend-request.model";
import { FriendsGateway } from './friends.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friendship, FriendRequest])
  ],
  providers: [FriendsService, FriendsGateway],
  exports: [FriendsService]
})
export class FriendsModule {}
