import Game from "./game";
import { SocketType } from "../game.types";
import {
  IAnswer,
  GameUpdatePacket,
  IGameMember,
  IQuestion,
  HelperType,
} from "@shared/game";
import Helper, { CheatFromOthers, ExtendTime, FifyFifty } from "./Helper";
export class GameMember {
  public username: string;
  public socket: SocketType;
  public game: Game;
  public disconnectTimeout: NodeJS.Timeout;

  public score: number = 0;

  public question: IQuestion;
  public answersHistory: boolean[];
  public availableHelpers: Helper[];
  public chosenCategory: number = -1;
  public chosenAnswer: IAnswer;
  public place: number;
  public roundScore: number = 0;

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
      id: this.socket.data.user?.id,
      username: this.username,
      owner: this.game.owner === this,
      score: this.score,
      availableHelpers: this.availableHelpers.map((helper) => helper.name),
      chosenCategory: this.chosenCategory,
      chosenAnswer: this.chosenAnswer,
      hiddenAnswers: this.hiddenAnswers,
      showOtherPlayersAnswers: this.showOtherPlayersAnswers,
      iconColor: this.socket.data.iconColor,
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

  useHelper(helperName: HelperType) {
    if (this.game.settings.blackListedHelpers?.includes(helperName)) {
      this.socket.emit("notification", "Ten pomocnik jest wyłączony!");
      return;
    }
    const helper = this.availableHelpers.find(
      (helper) => helper.name === helperName
    );
    if (!helper) {
      this.socket.emit("notification", "Już zużyłeś to koło!");
      return;
    }

    helper.execute(this.socket, this.game.gameService);
  }
  reset() {
    this.score = 0;
    this.roundScore = 0;
    this.chosenCategory = -1;
    this.chosenAnswer = null;
    this.place = null;
    this.hiddenAnswers = null;
    this.showOtherPlayersAnswers = false;
    this.timeToAnswer = null;
    this.answerEndTime = null;
    this.availableHelpers = [
      new FifyFifty(),
      new ExtendTime(),
      new CheatFromOthers(),
    ];
  }
}
