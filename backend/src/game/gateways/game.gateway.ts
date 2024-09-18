import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import { SocketServerType, SocketType } from "../game.types";
import { JwtService } from "@nestjs/jwt";
import { GameService } from "../services/game.service";
import { forwardRef, Inject, UseFilters } from "@nestjs/common";
import { log } from "console";
import { WsCatchAllFilter } from "src/exceptions/ws-catch-all-filter";
import { GameType } from "@shared/game";

@UseFilters(WsCatchAllFilter)
@WebSocketGateway()
export class GameGateway {
  @WebSocketServer()
  server: SocketServerType;

  constructor(
    private readonly jwtService: JwtService,

    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService
  ) {}
  handleConnection(client: SocketType) {
    log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: SocketType) {
    log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("create_game")
  async createNewGame(
    @ConnectedSocket() ownerSocket: SocketType,
    @MessageBody() createGameData: GameType
  ) {
    log("hejka test");

    if (ownerSocket.data.gameId) {
      throw new WsException("Jesteś już w grze!");
    }
    const game = this.gameService.createGame(ownerSocket, createGameData);
    game.send(ownerSocket);

    game.owner.sendNotification(
      `Utworzono grę ${JSON.stringify(game.getPacket())}`
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
}
