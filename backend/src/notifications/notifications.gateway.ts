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
import { forwardRef, Inject } from "@nestjs/common";
import { INotification } from "@shared/notifications";

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

  handleConnection(client: SocketType) {
    this.notificationsService.onConnection(client);
  }

  @SubscribeMessage('send_game_invite')
  onGameInvite(@ConnectedSocket() socket: SocketType, @MessageBody() userId: number) {
    this.notificationsService.sendGameInvite(socket, userId);
  }

  @SubscribeMessage('decline_notification')
  onAcceptNotification(@ConnectedSocket() socket: SocketType, @MessageBody() notification: INotification) {
    this.notificationsService.declineNotification(socket, notification);
  }
}
