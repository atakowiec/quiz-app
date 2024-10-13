import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { SocketServerType, SocketType } from "../game/game.types";
import { FriendsService } from "./friends.service";
import { forwardRef, Inject, UseFilters, UseGuards } from "@nestjs/common";
import { WsCatchAllFilter } from "../exceptions/ws-catch-all-filter";
import { WsAuthGuard } from "../guards/ws-auth.guard";

@WebSocketGateway()
@UseFilters(WsCatchAllFilter)
export class FriendsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public readonly server: SocketServerType;

  constructor(
    @Inject(forwardRef(() => FriendsService))
    private readonly friendsService: FriendsService) {
    // empty
  }

  async handleDisconnect(client: SocketType) {
    await this.friendsService.onDisconnect(client);
  }

  async handleConnection(client: SocketType) {
    await this.friendsService.onConnect(client);
  }

  @SubscribeMessage('invite_friend')
  @UseGuards(WsAuthGuard)
  async onInvite(@ConnectedSocket() socket: SocketType, @MessageBody() userId: number) {
    await this.friendsService.inviteFriend(socket, userId);
  }

  @SubscribeMessage('remove_friend')
  @UseGuards(WsAuthGuard)
  async onRemove(@ConnectedSocket() socket: SocketType, @MessageBody() userId: number) {
    await this.friendsService.removeFriend(socket, userId);
  }

  @SubscribeMessage('cancel_friend_request')
  @UseGuards(WsAuthGuard)
  async onRequestCancel(@ConnectedSocket() socket: SocketType, @MessageBody() userId: number) {
    await this.friendsService.cancelRequest(socket, userId);
  }
}
