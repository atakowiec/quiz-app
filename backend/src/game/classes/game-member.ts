import Game from "./game";
import { SocketType } from "../game.types";
import { Answer, Category, HelperType, IGameMember } from "@shared/game";
export class GameMember {
  public username: string;
  public socket: SocketType;
  public game: Game;

  public score: number;

  public available_helpers: HelperType[];
  public choosen_category: Category;
  public choosen_answer: Answer;
  public is_answer_correct: boolean;

  // Propably for the "50/50" helper
  public hidden_answers: Answer[];

  // Propably for the "Cheat from others" helper
  public are_all_answers_hidden: boolean;

  // For the "Extend time" helper
  public time_to_answer: number;

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
      available_helpers: this.available_helpers,
      choosen_category: this.choosen_category,
      choosen_answer: this.choosen_answer,
      is_answer_correct: this.is_answer_correct,
      hidden_answers: this.hidden_answers,
      are_all_answers_hidden: this.are_all_answers_hidden,
      time_to_answer: this.time_to_answer,
    };
  }

  sendGameUpdate() {
    this.socket.emit("set_game", this.game.getPacket());
  }
}
