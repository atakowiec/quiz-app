import {Module} from '@nestjs/common';
import {FriendsService} from './services/friends.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Friendship} from "./model/friendship.model";
import {FriendRequest} from "./model/friend-request.model";
import {FriendsGateway} from './gateways/friends.gateway';
import {FriendsController} from './controllers/friends.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Friendship, FriendRequest])
    ],
    providers: [FriendsService, FriendsGateway],
    exports: [FriendsService],
    controllers: [FriendsController]
})
export class FriendsModule {
}
