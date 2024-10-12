import { forwardRef, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { GameModule } from "../game/game.module";
import { UserModule } from "../user/user.module";
import { FriendsModule } from "../friends/friends.module";

@Module({
  imports: [GameModule, FriendsModule, forwardRef(() => UserModule)],
  providers: [NotificationsService, NotificationsGateway]
})
export class NotificationsModule {}
