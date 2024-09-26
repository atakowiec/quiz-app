import Game from "./game";
import { SocketType } from "../game.types";
import {
  IAnswer,
  GameUpdatePacket,
  IGameMember,
  IQuestion,
} from "@shared/game";
import Helper, { CheatFromOthers, ExtendTime, FifyFifty } from "./Helper";
export class GameMember {
  public username: string;
  public socket: SocketType;
  public game: Game;
  public disconnectTimeout: NodeJS.Timeout;

  public score: number;

  public question: IQuestion;
  public answersHistory: boolean[];
  public availableHelpers: Helper[];
  public chosenCategory: number = -1;
  public chosenAnswer: IAnswer;

  // Propably for the "50/50" helper
  public hiddenAnswers: IAnswer[];

  // Propably for the "Cheat from others" helper
  public showOtherPlayersAnswers: boolean = false;

  // For the "Extend time" helper
  public timeToAnswer: number;

  // Holds the player's time to answer the question - in unix time
  public answerEndTime: number;

  constructor(socket: SocketType, game: Game) {
    this.game = game;
    this.username = socket.data.username;
    this.socket = socket;

    // TODO: Implement whitelist for helpers
    this.availableHelpers = [
      new FifyFifty(),
      new ExtendTime(),
      new CheatFromOthers(),
    ];
  }

  public sendNotification(message: string) {
    this.socket.emit("notification", message);
  }

  getPacket(): IGameMember {
    return {
      username: this.username,
      owner: this.game.owner === this,
      score: this.score,
      availableHelpers: this.availableHelpers.map((helper) => helper.name),
      chosenCategory: this.chosenCategory,
      chosenAnswer: this.chosenAnswer,
      hiddenAnswers: this.hiddenAnswers,
      showOtherPlayersAnswers: this.showOtherPlayersAnswers
    };
  }

  sendGame() {
    this.socket.emit("set_game", this.game.getPacket(this));
  }

  sendGameUpdate(updatePacket: GameUpdatePacket) {
    this.socket.emit("update_game", updatePacket);
  }

  setDisconnectTimeout(cb: () => void) {
    if (this.disconnectTimeout) {
      clearTimeout(this.disconnectTimeout);
    }

    this.disconnectTimeout = setTimeout(cb, 1000 * 60);
  }

  clearDisconnectTimeout() {
    clearTimeout(this.disconnectTimeout);
    this.disconnectTimeout = null;
  }

  useHelper(helperName: string) {
    const helper = this.availableHelpers.find(
      (helper) => helper.name === helperName
    );
    if (!helper) {
      this.socket.emit("notification", "Już zużyłeś to koło!");
      return;
    }

    helper.execute(this.socket, this.game.gameService);
  }
}
