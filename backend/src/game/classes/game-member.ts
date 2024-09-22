import Game from "./game";
import { SocketType } from "../game.types";
import { IAnswer, GameUpdatePacket, HelperType, IGameMember, IQuestion } from "@shared/game";

export class GameMember {
  public username: string;
  public socket: SocketType;
  public game: Game;

  public score: number;

  public question: IQuestion;
  public answersHistory: boolean[]
  public availableHelpers: HelperType[];
  public chosenCategory: number = -1;
  public chosenAnswer: IAnswer;

  // Propably for the "50/50" helper
  public hiddenAnswers: IAnswer[];

  // Propably for the "Cheat from others" helper
  public areAllAnswersHidden: boolean;

  // For the "Extend time" helper
  public timeToAnswer: number;

  // Holds the player's time to answer the question - in unix time
  public answerEndTime: number;

  constructor(socket: SocketType, game: Game) {
    this.game = game;
    this.username = socket.data.username;
    this.socket = socket;
  }

  public sendNotification(message: string) {
    this.socket.emit("notification", message);
  }

  getPacket(): IGameMember {
    return {
      username: this.username,
      owner: this.game.owner === this,
      score: this.score,
      availableHelpers: this.availableHelpers,
      chosenCategory: this.chosenCategory,
      chosenAnswer: this.chosenAnswer,
      hiddenAnswers: this.hiddenAnswers,
      areAllAnswersHidden: this.areAllAnswersHidden,
      answerEndTime: this.answerEndTime,
    };
  }

  sendGame() {
    this.socket.emit("set_game", this.game.getPacket(this));
  }

  sendGameUpdate(updatePacket: GameUpdatePacket) {
    this.socket.emit("update_game", updatePacket);
  }
}
