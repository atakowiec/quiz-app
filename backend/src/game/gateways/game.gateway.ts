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
import { forwardRef, Inject } from "@nestjs/common";
import { GameSettings } from "@shared/game";
import { log } from "console";

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer()
  server: SocketServerType;

  constructor(
    private readonly jwtService: JwtService,

    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService
  ) {}

  @SubscribeMessage("create_game")
  async createNewGame(
    @ConnectedSocket() ownerSocket: SocketType,
    @MessageBody() settings?: GameSettings
  ) {
    if (ownerSocket.data.gameId) {
      throw new WsException("Jesteś już w grze!");
    }
    //const game = this.gameService.createGame(ownerSocket, settings);
    //this.server.to(game.id).emit("game_update", game.getPacket());
    log("createNewGame", settings, ownerSocket.data);
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
    this.server.to(gameId).emit("game_update", game.getPacket());
  }

  @SubscribeMessage("get_game")
  getGame(@MessageBody() id: string) {
    const game = this.gameService.getGameById(id);
    if (!game) {
      throw new WsException("Gra nie istnieje!");
    }
    return game.getPacket();
  }
}
