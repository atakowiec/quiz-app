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
import { GameService } from "../services/game.service";
import { forwardRef, Inject, Logger, UseFilters } from "@nestjs/common";
import { WsCatchAllFilter } from "src/exceptions/ws-catch-all-filter";
import { CategoryId, GameSettings, GameType, HelperType } from "@shared/game";
import { MatchmakingService } from "src/matchmaking/services/matchmaking.service";
import { EventEmitter2 } from "@nestjs/event-emitter";

@UseFilters(WsCatchAllFilter)
@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(GameGateway.name);

  @WebSocketServer()
  server: SocketServerType;

  constructor(
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService,
    private readonly matchMakingService: MatchmakingService,
    @Inject()
    public readonly eventEmitter: EventEmitter2
  ) {}

  handleConnection(client: SocketType) {
    this.logger.log(`Client connected: ${client.data.username} [${client.id}]`);

    this.gameService.getGameByUsername(client.data.username)?.reconnect(client);
  }

  handleDisconnect(client: SocketType) {
    this.logger.log(
      `Client disconnected: ${client.data.username} [${client.id}]`
    );
    this.matchMakingService.tryRemovePlayerFromQueue(client);

    this.gameService
      .getGameByUsername(client.data.username)
      ?.onPlayerDisconnect(client);
  }

  @SubscribeMessage("create_game")
  async createNewGame(
    @ConnectedSocket() ownerSocket: SocketType,
    @MessageBody() createGameData: GameType
  ) {
    if (ownerSocket.data.gameId) {
      throw new WsException("Jesteś już w grze!");
    }
    this.matchMakingService.tryRemovePlayerFromQueue(ownerSocket);

    const game = this.gameService.createGame(ownerSocket, createGameData);
    game.send(ownerSocket);

    game.owner.sendNotification("Utworzono grę");

    this.logger.log(
      `New game with id: ${game.id} created by ${ownerSocket.data.username}`
    );

    // return something so the client can redirect to the waiting room
    // look at the "start_game" event call in the frontend app - there is acknowledgement
    return game.id;
  }

  @SubscribeMessage("join_game")
  joinGame(
    @ConnectedSocket() playerSocket: SocketType,
    @MessageBody() gameId: string
  ) {
    if (playerSocket.data.gameId) {
      throw new WsException("Jesteś już w grze!");
    }
    this.matchMakingService.tryRemovePlayerFromQueue(playerSocket);
    const game = this.gameService.getGameById(gameId);
    if (!game) {
      throw new WsException("Gra nie istnieje!");
    }

    game.join(playerSocket);

    this.eventEmitter.emit("game_joined", playerSocket, game);

    return game.id;
  }

  @SubscribeMessage("leave_game")
  leaveGame(@ConnectedSocket() playerSocket: SocketType) {
    const game = this.gameService.getGameByUsername(playerSocket.data.username);
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
    const game = this.gameService.getGameByUsername(ownerSocket.data.username);
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
    const game = this.gameService.getGameByUsername(ownerSocket.data.username);
    if (!game) {
      throw new WsException("Nie jesteś w żadnej grze!");
    }
    if (game.owner.username !== ownerSocket.data.username) {
      throw new WsException("Nie jesteś właścicielem gry!");
    }
    game.giveOwner(username);
  }

  @SubscribeMessage("start_game")
  async startGame(@ConnectedSocket() ownerSocket: SocketType) {
    const game = this.gameService.getGameByUsername(ownerSocket.data.username);
    if (!game) {
      throw new WsException("Nie jesteś w żadnej grze!");
    }

    if (game.owner.username !== ownerSocket.data.username) {
      throw new WsException("Nie jesteś właścicielem gry!");
    }

    // TODO: Odkomentować to, narazie nie chce mi sie dwóch klientów odpalać

    // if (game.gameType !== "single" && game.players.length == 0) {
    //   throw new WsException("Nie można rozpocząć gry bez graczy!");
    // }

    await game.start();
  }

  @SubscribeMessage("select_category")
  selectCategory(
    @ConnectedSocket() playerSocket: SocketType,
    @MessageBody() categoryId: number
  ) {
    const game = this.gameService.getGameByUsername(playerSocket.data.username);
    if (!game) {
      throw new WsException("Nie jesteś w żadnej grze!");
    }

    game.selectCategory(playerSocket, categoryId);
  }

  @SubscribeMessage("select_answer")
  selectAnswer(
    @ConnectedSocket() playerSocket: SocketType,
    @MessageBody() answer: string
  ) {
    const game = this.gameService.getGameByUsername(playerSocket.data.username);
    if (!game) {
      throw new WsException("Nie jesteś w żadnej grze!");
    }

    game.selectAnswer(playerSocket, answer);
  }

  @SubscribeMessage("use_helper")
  useHelper(
    @ConnectedSocket() playerSocket: SocketType,
    @MessageBody() helperName: HelperType
  ) {
    const player = this.gameService.getMemberByName(playerSocket.data.username);
    if (!player) {
      throw new WsException("Nie jesteś w żadnej grze!");
    }
    try {
      player.useHelper(helperName);
    } catch (e) {
      throw new WsException(e.message);
    }
  }

  @SubscribeMessage("change_settings")
  changeSettings(
    @ConnectedSocket() playerSocket: SocketType,
    @MessageBody() settings: Partial<GameSettings>
  ) {
    const game = this.gameService.getGameByUsername(playerSocket.data.username);
    if (!game) {
      throw new WsException("Nie jesteś w żadnej grze!");
    }

    if (game.owner.username !== playerSocket.data.username) {
      throw new WsException("Nie jesteś właścicielem gry!");
    }
    this.logger.log(`Changing settings for game ${game.id}`);
    game.changeSettings(settings);
  }

  @SubscribeMessage("change_settings_helpers")
  changeSettingsHelpers(
    @ConnectedSocket() playerSocket: SocketType,
    @MessageBody() blackListedHelpers: HelperType[]
  ) {
    const game = this.gameService.getGameByUsername(playerSocket.data.username);
    if (!game) {
      throw new WsException("Nie jesteś w żadnej grze!");
    }

    if (game.owner.username !== playerSocket.data.username) {
      throw new WsException("Nie jesteś właścicielem gry!");
    }
    this.logger.log(`Changing helpers for game ${game.id}`);
    game.changeSettingsHelpers(blackListedHelpers);
  }

  @SubscribeMessage("change_settings_categories")
  changeSettingsCategories(
    @ConnectedSocket() playerSocket: SocketType,
    @MessageBody() whiteListedCategories: CategoryId[]
  ) {
    const game = this.gameService.getGameByUsername(playerSocket.data.username);
    if (!game) {
      throw new WsException("Nie jesteś w żadnej grze!");
    }

    if (game.owner.username !== playerSocket.data.username) {
      throw new WsException("Nie jesteś właścicielem gry!");
    }
    this.logger.log(`Changing categories for game ${game.id}`);

    game.changeSettingsCategories(whiteListedCategories);
  }

  @SubscribeMessage("join_queue")
  joinQueue(@ConnectedSocket() playerSocket: SocketType): string {
    if (playerSocket.data.gameId) {
      throw new WsException("Jesteś już w grze!");
    }
    this.logger.log(`Player ${playerSocket.data.username} joined the queue`);

    const game = this.matchMakingService.queuePlayer(playerSocket);
    if (game) {
      return game.id;
    } else {
      return "NO_GAME";
    }
  }

  @SubscribeMessage("leave_queue")
  leaveQueue(@ConnectedSocket() playerSocket: SocketType): number {
    this.logger.log(`Player ${playerSocket.data.username} left the queue`);
    this.matchMakingService.tryRemovePlayerFromQueue(playerSocket);
    return 200;
  }

  @SubscribeMessage("play_again")
  playAgain(@ConnectedSocket() ownerSocket: SocketType) {
    const game = this.gameService.getGameByUsername(ownerSocket.data.username);
    if (!game) {
      throw new WsException("Nie jesteś w żadnej grze!");
    }
    if (game.owner.username !== ownerSocket.data.username) {
      throw new WsException("Nie jesteś właścicielem gry!");
    }
    const newGame = this.gameService.createGame(ownerSocket, game.gameType);
    newGame.settings = game.settings;
    newGame.send(ownerSocket);
    newGame.owner.sendNotification("Zaczęto nową grę");

    this.gameService.removeGame(game);

    game.players.forEach((player) => {
      player.socket.data.gameId = newGame.id;
      newGame.join(player.socket);
      player.socket.emit("game_joined");
    });
    game.send();

    return newGame.id;
  }

  /**
   * Handles player disconnecting from the game using button in the game
   * Player is removed from the game and the game is removed if there are no players left
   * @param playerSocket
   */
  @SubscribeMessage("leave_not_ended_game")
  leaveNotEndedGame(@ConnectedSocket() playerSocket: SocketType) {
    const game = this.gameService.getGameByUsername(playerSocket.data.username);
    if (!game) {
      throw new WsException("Nie jesteś w żadnej grze!");
    }
    game.removePlayer(game.getPlayer(playerSocket));
    if (game.players.length === 0) {
      this.gameService.removeGame(game);
    }
  }
}
