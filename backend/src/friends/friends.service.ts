import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { FriendRequest } from "./model/friend-request.model";
import { Repository } from "typeorm";
import { Friendship } from "./model/friendship.model";
import { SocketType } from "../game/game.types";
import { WsException } from "@nestjs/websockets";
import { User } from "../user/user.model";
import { FriendshipStatus } from "@shared/user";
import { EventEmitter2 } from "@nestjs/event-emitter";
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
    private readonly friendsGateway: FriendsGateway,
  ) {
    // empty
  }

  async inviteFriend(inviterSocket: SocketType, inviteeId: number): Promise<FriendshipStatus> {
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
    if (friendRequest?.invitee.id === inviteeId && friendRequest?.inviter.id === inviter.id) {
      throw new WsException("Już wysłałeś zaproszenie do tej osoby");
    }

    if (friendRequest) {
      return await this.acceptFriendRequest(inviterSocket, friendRequest);
    }

    const newFriendRequest = this.friendRequestRepository.create({
      inviter: {
        id: inviter.id
      },
      invitee: {
        id: inviteeId
      },
    })

    await this.friendRequestRepository.save(newFriendRequest);

    this.eventEmitter.emit("friend_request_sent", await this.getFriendRequest(inviteeId, inviter.id));

    inviterSocket.emit("notification", "Zaproszenie zostało wysłane");
    return "requested";
  }

  async removeFriend(socket: SocketType, userId: number): Promise<FriendshipStatus> {
    const friendship = await this.getFriendship(socket.data.user.id, userId);

    if (!friendship) {
      throw new WsException("Nie jesteście znajomymi");
    }

    await this.friendshipRepository.remove(friendship);

    socket.emit("notification", "Usunięto znajomego");

    return "none";
  }

  async cancelRequest(socket: SocketType, userId: number): Promise<FriendshipStatus> {
    const friendRequest = await this.getFriendRequest(socket.data.user.id, userId);

    if (!friendRequest) {
      throw new WsException("Nie wysłałeś zaproszenia do tej osoby");
    }

    this.eventEmitter.emit("friend_request_handled", friendRequest);

    await this.friendRequestRepository.remove(friendRequest);

    socket.emit("notification", "Anulowano zaproszenie");

    return "none";
  }

  async declineRequest(socket: SocketType, inviterId: number, inviteeId: number): Promise<FriendshipStatus> {
    const friendRequest = await this.getFriendRequest(inviterId, inviteeId);

    if (!friendRequest) {
      throw new WsException("Nie masz zaproszenia od tej osoby");
    }

    this.eventEmitter.emit("friend_request_handled", friendRequest);

    await this.friendRequestRepository.remove(friendRequest);

    socket.emit("notification", "Odrzucono zaproszenie");

    return "none";
  }

  public async areFriends(userId1: number, userId2: number) {
    return !!await this.getFriendship(userId1, userId2);
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
            id: userId1
          },
          invitee: {
            id: userId2
          }
        },
        {
          inviter: {
            id: userId2
          },
          invitee: {
            id: userId1
          }
        }
      ]
    });
  }

  public async getFriendship(userId1: number, userId2: number) {
    return await this.friendshipRepository.findOne({
      where: [
        {
          user_1: {
            id: userId1
          }, user_2: {
            id: userId2
          }
        },
        {
          user_1: {
            id: userId2
          }, user_2: {
            id: userId1
          }
        }
      ]
    });
  }

  private async acceptFriendRequest(socket: SocketType, friendRequest: FriendRequest): Promise<FriendshipStatus> {
    const friendship = this.friendshipRepository.create({
      user_1: {
        id: friendRequest.inviter.id
      },
      user_2: {
        id: friendRequest.invitee.id
      },
    })

    await this.friendshipRepository.save(friendship);

    this.eventEmitter.emit("friend_request_handled", friendRequest);

    await this.friendRequestRepository.remove(friendRequest);

    socket.emit("notification", "Zaproszenie zostało zaakceptowane");

    return "friend";
  }

  async getPendingRequests(userId: number) {
    return await this.friendRequestRepository.find({
      where: {
        invitee: {
          id: userId
        }
      },
      relations: ["inviter", "invitee"]
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
            id: user.id
          }
        },
        {
          user_2: {
            id: user.id
          }
        }
      ],
      relations: ["user_1", "user_2"]
    });

    return friendships.map(friendship => {
      const friend = friendship.user_1.id === user.id ? friendship.user_2 : friendship.user_1;
      const friendSocket = this.getUserSocket(friend.id);

      return {
        id: friend.id,
        username: friend.username,
        status: !friendSocket ? "offline" : friendSocket.data.gameId ? "ingame" : "online"
      } as Friend
    }).sort((a: Friend, b:Friend) => {
      // not sure if this is the best way to sort friends
      if(a.status == "online")
        return 1;

      if(a.status == "ingame" && b.status == "online")
        return -1;

      if(a.status == "ingame" && b.status == "offline")
        return 1;

      return 0;
    });
  }
}
