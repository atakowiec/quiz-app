import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SocketServerType, SocketType } from "../game/game.types";
import { FriendsService } from "./friends.service";
import { UseFilters, UseGuards } from "@nestjs/common";
import { WsCatchAllFilter } from "../exceptions/ws-catch-all-filter";
import { WsAuthGuard } from "../guards/ws-auth.guard";
import { FriendshipStatus } from "@shared/user";

@WebSocketGateway()
@UseFilters(WsCatchAllFilter)
export class FriendsGateway {
  @WebSocketServer()
  public readonly server: SocketServerType;

  constructor(private readonly friendsService: FriendsService) {
    // empty
  }

  @SubscribeMessage('invite_friend')
  @UseGuards(WsAuthGuard)
  onInvite(@ConnectedSocket() socket: SocketType, @MessageBody() userId: number): Promise<FriendshipStatus> {
    return this.friendsService.inviteFriend(socket, userId);
  }

  @SubscribeMessage('remove_friend')
  @UseGuards(WsAuthGuard)
  onRemove(@ConnectedSocket() socket: SocketType, @MessageBody() userId: number): Promise<FriendshipStatus> {
    return this.friendsService.removeFriend(socket, userId);
  }

  @SubscribeMessage('cancel_friend_request')
  @UseGuards(WsAuthGuard)
  onRequestCancel(@ConnectedSocket() socket: SocketType, @MessageBody() userId: number): Promise<FriendshipStatus> {
    return this.friendsService.cancelRequest(socket, userId);
  }
}
