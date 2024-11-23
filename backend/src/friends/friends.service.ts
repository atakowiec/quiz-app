import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendRequest } from "./model/friend-request.model";
import { Repository } from "typeorm";
import { Friendship } from "./model/friendship.model";
import { SocketType } from "../game/game.types";
import { WsException } from "@nestjs/websockets";
import { User } from "../user/user.model";
import { UserStatus } from "@shared/user";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { TokenPayload } from "../auth/auth";
import { Friend } from "@shared/friends";
import { FriendsGateway } from "./friends.gateway";

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    @Inject()
    private readonly eventEmitter: EventEmitter2,
    @Inject()
    private readonly friendsGateway: FriendsGateway
  ) {
    // empty
  }

  async onConnect(client: SocketType) {
    if (!client.data.user?.id) return; // not logged in

    // find all friendships
    const friends = await this.getFriends(client.data.user);

    // find all friend requests
    const pendingRequests = await this.getAllUserRequests(client.data.user.id);

    // send the data to the client
    client.emit("set_friends", friends);
    client.emit("set_friend_requests", pendingRequests.map((request) => request.toINotification()));

    for (const friend of friends) {
      client.join(`friend-${friend.id}`);
    }

    // notify the friends that the user is online
    this.notifyFriendsAboutStatusChange(client.data.user.id, "online");
  }

  async onDisconnect(client: SocketType) {
    if (!client.data.user?.id) return; // not logged in

    // notify the friends that the user is offline
    this.notifyFriendsAboutStatusChange(client.data.user.id, "offline");
  }

  @OnEvent("game_join")
  async onGameJoin(socket: SocketType) {
    if (!socket.data.user?.id) return;

    this.notifyFriendsAboutStatusChange(socket.data.user?.id, "ingame");
  }

  @OnEvent("game_leave")
  async onGameLeave(socket: SocketType) {
    if (!socket.data.user?.id) {
      console.log("User is not logged in");
      return;
    }

    socket = this.getUserSocket(socket.data.user?.id); // try to get the socket again because the user might have disconnected

    if (!socket?.connected) {
      return;
    }

    this.notifyFriendsAboutStatusChange(socket.data.user?.id, "online");
  }

  notifyFriendsAboutStatusChange(userId: number, status: UserStatus) {
    this.friendsGateway.server.to(`friend-${userId}`).emit("update_friend_status", userId, status);
  }

  notifyNewFriendship(friendship: Friendship) {
    const user1Socket = this.getUserSocket(friendship.user_1.id);
    const user2Socket = this.getUserSocket(friendship.user_2.id);

    if (user1Socket) {
      const friend: Friend = {
        id: friendship.user_2.id,
        username: friendship.user_2.username,
        iconColor: friendship.user_2.iconColor,
        status: !user2Socket
          ? "offline"
          : user2Socket?.data.gameId
            ? "ingame"
            : "online",
      };

      user1Socket.emit("new_friend", friend);
    }

    if (user2Socket) {
      const friend: Friend = {
        id: friendship.user_1.id,
        username: friendship.user_1.username,
        iconColor: friendship.user_1.iconColor,
        status: !user1Socket
          ? "offline"
          : user1Socket?.data.gameId
            ? "ingame"
            : "online",
      };

      user2Socket.emit("new_friend", friend);
    }
  }

  @OnEvent("friend_request_sent")
  notifyNewFriendRequest(friendRequest: FriendRequest) {
    const inviteeSocket = this.getUserSocket(friendRequest.invitee.id);
    if (inviteeSocket) {
      inviteeSocket.emit("new_friend_request", friendRequest.toINotification());
    }

    const inviterSocket = this.getUserSocket(friendRequest.inviter.id);
    if (inviterSocket) {
      inviterSocket.emit("new_friend_request", friendRequest.toINotification());
    }
  }

  @OnEvent("friend_request_handled")
  notifyFriendRequestRemove(friendRequest: FriendRequest) {
    const requestId = friendRequest.toINotification().id;

    const inviteeSocket = this.getUserSocket(friendRequest.invitee.id);
    if (inviteeSocket) {
      inviteeSocket.emit("remove_friend_request", requestId);
    }

    const inviterSocket = this.getUserSocket(friendRequest.inviter.id);
    if (inviterSocket) {
      inviterSocket.emit("remove_friend_request", requestId);
    }
  }

  @OnEvent("user.icon_changed")
  async notifyIconChange(user: User, color: string) {
    this.friendsGateway.server.to(`friend-${user.id}`).emit("update_friend_icon", user.id, color);
  }

  async inviteFriend(inviterSocket: SocketType, inviteeId: number) {
    const inviter: User = inviterSocket.data.user;
    // check if the user is not inviting himself
    if (inviter.id === inviteeId) {
      throw new WsException("Nie możesz zaprosić samego siebie");
    }

    // check if the user is not already friends with the invitee
    if (await this.areFriends(inviter.id, inviteeId)) {
      throw new WsException("Jesteście już znajomymi");
    }

    const friendRequest = await this.getFriendRequest(inviteeId, inviter.id);
    // check if the user has already sent an invitation to the invitee
    if (
      friendRequest?.invitee.id === inviteeId &&
      friendRequest?.inviter.id === inviter.id
    ) {
      throw new WsException("Już wysłałeś zaproszenie do tej osoby");
    }

    if (friendRequest) {
      await this.acceptFriendRequest(inviterSocket, friendRequest);
      return;
    }

    const newFriendRequest = this.friendRequestRepository.create({
      inviter: {
        id: inviter.id,
      },
      invitee: {
        id: inviteeId,
      },
    });

    await this.friendRequestRepository.save(newFriendRequest);

    this.eventEmitter.emit(
      "friend_request_sent",
      await this.getFriendRequest(inviteeId, inviter.id)
    );

    inviterSocket.emit("notification", "Zaproszenie zostało wysłane");
  }

  async removeFriend(socket: SocketType, userId: number) {
    const friendship = await this.getFriendship(socket.data.user?.id, userId);

    if (!friendship) {
      throw new WsException("Nie jesteście znajomymi");
    }

    await this.friendshipRepository.delete(friendship.id);

    // notify both users that the friendship has been removed
    socket.emit("remove_friend", userId);
    socket.leave(`friend-${userId}`);

    const friendSocket = this.getUserSocket(userId);
    if (friendSocket) {
      friendSocket.leave(`friend-${socket.data.user.id}`);
      friendSocket.emit("remove_friend", socket.data.user?.id);
    }

    socket.emit("notification", "Usunięto znajomego");
  }

  async cancelRequest(socket: SocketType, userId: number) {
    const friendRequest = await this.getFriendRequest(
      socket.data.user.id,
      userId
    );

    if (!friendRequest) {
      throw new WsException("Nie wysłałeś zaproszenia do tej osoby");
    }

    this.eventEmitter.emit("friend_request_handled", friendRequest);

    await this.friendRequestRepository.delete(friendRequest.id);

    socket.emit("notification", "Anulowano zaproszenie");
  }

  async declineRequest(
    socket: SocketType,
    inviterId: number,
    inviteeId: number
  ) {
    const friendRequest = await this.getFriendRequest(inviterId, inviteeId);

    if (!friendRequest) {
      throw new WsException("Nie masz zaproszenia od tej osoby");
    }

    this.eventEmitter.emit("friend_request_handled", friendRequest);

    await this.friendRequestRepository.delete(friendRequest.id);

    socket.emit("notification", "Odrzucono zaproszenie");

    return "none";
  }

  public async areFriends(userId1: number, userId2: number) {
    return !!(await this.getFriendship(userId1, userId2));
  }

  /**
   * Returns FriendRequest between two users if it exists
   * @param userId1 id of the first user
   * @param userId2 id of the second user
   * @private
   */
  public async getFriendRequest(userId1: number, userId2: number) {
    return await this.friendRequestRepository.findOne({
      relations: ["inviter", "invitee"],
      where: [
        {
          inviter: {
            id: userId1,
          },
          invitee: {
            id: userId2,
          },
        },
        {
          inviter: {
            id: userId2,
          },
          invitee: {
            id: userId1,
          },
        },
      ],
    });
  }

  public async getFriendship(userId1: number, userId2: number) {
    return await this.friendshipRepository.findOne({
      where: [
        {
          user_1: {
            id: userId1,
          },
          user_2: {
            id: userId2,
          },
        },
        {
          user_1: {
            id: userId2,
          },
          user_2: {
            id: userId1,
          },
        },
      ],
    });
  }

  private async acceptFriendRequest(socket: SocketType, friendRequest: FriendRequest) {
    const friendship = this.friendshipRepository.create({
      user_1: {
        id: friendRequest.inviter.id,
        username: friendRequest.inviter.username
      },
      user_2: {
        id: friendRequest.invitee.id,
        username: friendRequest.invitee.username
      },
    });

    const newFriendship = await this.friendshipRepository.save(friendship);
    await this.friendRequestRepository.delete(friendRequest.id);

    socket.join(`friend-${friendRequest.inviter.id}`);
    this.getUserSocket(friendRequest.inviter.id)?.join(`friend-${socket.data.user.id}`);

    this.eventEmitter.emit("friend_request_handled", friendRequest);
    this.notifyNewFriendship(newFriendship);

    socket.emit("notification", "Zaproszenie zostało zaakceptowane");
  }

  async getPendingRequests(userId: number) {
    return await this.friendRequestRepository.find({
      where: {
        invitee: {
          id: userId,
        },
      },
      relations: ["inviter", "invitee"],
    });
  }

  public getUserSocket(userId: number): SocketType | null {
    for (const socket of this.friendsGateway.server.sockets.sockets.values()) {
      if (socket.data.user?.id === userId) {
        return socket;
      }
    }

    return null;
  }

  async getFriends(user: TokenPayload): Promise<Friend[]> {
    const friendships = await this.friendshipRepository.find({
      where: [
        {
          user_1: {
            id: user.id,
          },
        },
        {
          user_2: {
            id: user.id,
          },
        },
      ],
      relations: ["user_1", "user_2"],
    });

    return friendships
      .map((friendship): Friend => {
        const friend =
          friendship.user_1.id === user.id
            ? friendship.user_2
            : friendship.user_1;
        const friendSocket = this.getUserSocket(friend.id);

        return {
          id: friend.id,
          username: friend.username,
          iconColor: friend.iconColor,
          status: !friendSocket
            ? "offline"
            : friendSocket.data.gameId
              ? "ingame"
              : "online",
        };
      })
      .sort((a: Friend, b: Friend) => {
        // not sure if this is the best way to sort friends
        if (a.status == "online") return 1;

        if (a.status == "ingame" && b.status == "online") return -1;

        if (a.status == "ingame" && b.status == "offline") return 1;

        return 0;
      });
  }

  getAllUserRequests(userId: number) {
    return this.friendRequestRepository.find({
      where: [
        {
          invitee: {
            id: userId,
          },
        },
        {
          inviter: {
            id: userId,
          },
        },
      ],
      relations: ["inviter", "invitee"],
    });
  }
}
