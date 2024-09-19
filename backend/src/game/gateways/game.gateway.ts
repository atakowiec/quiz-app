import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import { SocketServerType, SocketType } from "../game.types";
import { JwtService } from "@nestjs/jwt";
import { GameService } from "../services/game.service";
import { forwardRef, Inject, Logger, UseFilters } from "@nestjs/common";
import { WsCatchAllFilter } from "src/exceptions/ws-catch-all-filter";
import { GameType } from "@shared/game";

@UseFilters(WsCatchAllFilter)
@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(GameGateway.name);

  @WebSocketServer()
  server: SocketServerType;

  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService
  ) {}

  handleConnection(client: SocketType) {
    this.logger.log(`Client connected: ${client.data.username} [client.id]`);

    this.gameService.getGameByNickname(client.data.username)?.reconnect(client);
  }

  handleDisconnect(client: SocketType) {
    this.logger.log(
      `Client disconnected: ${client.data.username} [${client.id}]`
    );

    // this.gameService.getGameByNickname(client.data.username)?.leave(client);
  }

  @SubscribeMessage("create_game")
  async createNewGame(
    @ConnectedSocket() ownerSocket: SocketType,
    @MessageBody() createGameData: GameType
  ) {
    if (ownerSocket.data.gameId) {
      throw new WsException("Jesteś już w grze!");
    }
    const game = this.gameService.createGame(ownerSocket, createGameData);
    game.send(ownerSocket);

    game.owner.sendNotification(
      `Utworzono grę`
    );

    this.logger.log(
      `New game with id: ${game.id} created by ${ownerSocket.data.username}`
    );
  }

  @SubscribeMessage("join_game")
  joinGame(
    @ConnectedSocket() playerSocket: SocketType,
    @MessageBody() gameId: string
  ) {
    if (playerSocket.data.gameId) {
      throw new WsException("Jesteś już w grze!");
    }
    const game = this.gameService.getGameById(gameId);
    if (!game) {
      throw new WsException("Gra nie istnieje!");
    }

    if (game.gameStatus !== "waiting_for_players") {
      throw new WsException("Gra już się rozpoczęła!");
    }
    if (game.players.length >= game.settings.max_number_of_players) {
      throw new WsException("Gra jest pełna!");
    }
    game.join(playerSocket);
    game.send();
    playerSocket.emit("notification", JSON.stringify(game.getPacket()));
  }

  @SubscribeMessage("leave_game")
  leaveGame(@ConnectedSocket() playerSocket: SocketType) {
    const game = this.gameService.getGameByNickname(playerSocket.data.username);
    if (!game) {
      throw new WsException("Nie jesteś w żadnej grze!");
    }
    game.leave(playerSocket);
  }

  @SubscribeMessage("kick")
  kickPlayer(
    @ConnectedSocket() ownerSocket: SocketType,
    @MessageBody() username: string
  ) {
    const game = this.gameService.getGameByNickname(ownerSocket.data.username);
    if (!game) {
      throw new WsException("Nie jesteś w żadnej grze!");
    }
    if (game.owner.username !== ownerSocket.data.username) {
      throw new WsException("Nie jesteś właścicielem gry!");
    }
    game.kick(username);
  }

  @SubscribeMessage("give_owner")
  giveOwner(
    @ConnectedSocket() ownerSocket: SocketType,
    @MessageBody() username: string
  ) {
    const game = this.gameService.getGameByNickname(ownerSocket.data.username);
    if (!game) {
      throw new WsException("Nie jesteś w żadnej grze!");
    }
    if (game.owner.username !== ownerSocket.data.username) {
      throw new WsException("Nie jesteś właścicielem gry!");
    }
    game.giveOwner(username);
  }
}
