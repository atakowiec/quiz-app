import {Module} from '@nestjs/common';
import {UserService} from './services/user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./model/user.model";
import {UserController} from './controllers/user.controller';
import {GameModule} from "../game/game.module";
import {FriendsModule} from "../friends/friends.module";

@Module({
    imports: [TypeOrmModule.forFeature([User]), GameModule, FriendsModule],
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController]
})
export class UserModule {
}
