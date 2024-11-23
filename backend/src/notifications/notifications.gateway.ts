import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { SocketServerType, SocketType } from "../game/game.types";
import { NotificationsService } from "./notifications.service";
import { forwardRef, Inject, UseFilters } from "@nestjs/common";
import { INotification } from "@shared/notifications";
import { WsCatchAllFilter } from "../exceptions/ws-catch-all-filter";

@UseFilters(WsCatchAllFilter)
@WebSocketGateway()
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  public readonly server: SocketServerType;

  constructor(
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService
  ) {
    // empty
  }

  async handleConnection(client: SocketType) {
    await this.notificationsService.onConnection(client);
  }

  @SubscribeMessage('send_game_invite')
  async onGameInvite(@ConnectedSocket() socket: SocketType, @MessageBody() userId: number) {
    await this.notificationsService.sendGameInvite(socket, userId);
  }

  @SubscribeMessage('decline_notification')
  async onDeclineNotification(@ConnectedSocket() socket: SocketType, @MessageBody() notification: INotification) {
    await this.notificationsService.declineNotification(socket, notification);
  }
}
