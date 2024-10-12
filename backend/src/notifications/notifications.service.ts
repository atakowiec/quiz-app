import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { SocketType } from "../game/game.types";
import { GameService } from "../game/services/game.service";
import { WsException } from "@nestjs/websockets";
import { UserService } from "../user/user.service";
import Notification from "./classes/notification";
import GameInvite from "./classes/game-invite";
import { NotificationsGateway } from "./notifications.gateway";
import { FriendsService } from "../friends/friends.service";
import Game from "../game/classes/game";
import { GameInviteNotification, INotification } from "@shared/notifications";
import { OnEvent } from "@nestjs/event-emitter";
import { FriendRequest } from "../friends/model/friend-request.model";

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly gameService: GameService,
    private readonly friendsService: FriendsService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly notificationGateway: NotificationsGateway,
  ) {
    // empty
  }

  public getUserSocket(userId: number): SocketType | null {
    for (const socket of this.notificationGateway.server.sockets.sockets.values()) {
      if (socket.data.user?.id === userId) {
        return socket;
      }
    }

    return null;
  }

  public getGameInvites(inviteeId: number): GameInvite[] {
    return this.gameService.games
      .map(game => game.invites.filter(invite => invite.invitee.id === inviteeId))
      .flat()
      .filter(Boolean);
  }

  public async getAllNotifications(userId: number): Promise<INotification[]> {
    const gameInvites = this.getGameInvites(userId)

    const friendRequests = await this.friendsService.getPendingRequests(userId)

    return [...gameInvites, ...friendRequests]
      .map(notification => notification.toINotification())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public getGameInvite(inviteeId: number, game?: Game): GameInvite | null {
    if (game) {
      return game.invites.find(invite => invite.invitee.id === inviteeId) || null;
    }

    for (const game of this.gameService.games) {
      const invite = game.invites.find(invite => invite.invitee.id === inviteeId);
      if (invite) {
        return invite;
      }
    }
  }

  public sendNotification(notification: Notification) {
    const socket = this.getUserSocket(notification.invitee.id);

    socket?.emit("new_notification", notification.toINotification());
  }

  async sendGameInvite(socket: SocketType, userId: number) {
    const game = this.gameService.getGameByUsername(socket.data.username)
    if (!game)
      throw new WsException("Nie jesteś w żadnej grze")

    const invitee = await this.userService.getUserById(userId)
    if (!invitee)
      throw new WsException("Nie znaleziono użytkownika")

    const inviter = await this.userService.getUserById(socket.data.user.id)
    if (!inviter)
      throw new WsException("Musisz byc zalogowany, aby zaprosić do gry!")

    if (!await this.friendsService.areFriends(inviter.id, invitee.id))
      throw new WsException("Musisz być znajomym, aby zaprosić do gry!")

    if (game.players.some(player => player.username === invitee.username))
      throw new WsException("Gracz już znajduje się w grze")

    if (this.getGameInvite(invitee.id, game))
      throw new WsException("Ten gracz jest już zaproszony do gry")

    const invite = new GameInvite(inviter, invitee, game)
    game.invites.push(invite);
    this.sendNotification(invite);
  }

  declineNotification(socket: SocketType, notification: INotification) {
    if (notification.type == "game_invite") {
      this.declineGameInvite(socket, notification as GameInviteNotification)
      return
    }

    if (notification.type == "friend_request") {
      this.declineFriendRequest(socket, notification)
      return;
    }

    this.logger.error(`Nieobsługiwany typ powiadomienia ${notification.type}`)
  }

  private declineFriendRequest(socket: SocketType, notification: INotification) {
    this.sendRemoveNotification(socket, notification)
    this.friendsService.declineRequest(socket, notification.inviter.id, notification.invitee.id)
  }

  private declineGameInvite(socket: SocketType, notification: GameInviteNotification) {
    const game = this.gameService.getGameById(notification.gameId)

    if (game) {
      const inviteIndex = game.invites.findIndex(invite => invite.id === notification.id);
      game.invites.splice(inviteIndex, 1)
    }

    socket.emit("notification", "Odrzucono zaproszenie do gry")

    this.sendRemoveNotification(socket, notification)
  }

  private sendRemoveNotification(socket: SocketType, notification: INotification) {
    socket.emit("remove_notification", notification.id);
  }

  @OnEvent("game_joined")
  onJoinGame(socket: SocketType, game: Game) {
    const invite = this.getGameInvite(socket.data.user.id, game)

    if (!invite)
      return;

    const inviteIndex = game.invites.findIndex(invite => invite.invitee.id === socket.data.user.id)
    game.invites.splice(inviteIndex, 1)

    this.sendRemoveNotification(socket, invite)
  }

  @OnEvent("friend_request_accepted")
  onAcceptFriendRequest(friendRequest: FriendRequest) {
    const inviteeSocket = this.getUserSocket(friendRequest.invitee.id)

    if (inviteeSocket) {
      this.sendRemoveNotification(inviteeSocket, friendRequest.toINotification())
    }
  }

  @OnEvent("game_destroyed")
  onGameDestroyed(game: Game) {
    for (const invite of game.invites) {
      const inviteeSocket = this.getUserSocket(invite.invitee.id)

      if (inviteeSocket) {
        this.sendRemoveNotification(inviteeSocket, invite)
      }
    }
  }

  async onConnection(client: SocketType) {
    const userId = client.data.user.id
    const notifications = await this.getAllNotifications(userId)

    client.emit("set_notifications", notifications)
  }
}
