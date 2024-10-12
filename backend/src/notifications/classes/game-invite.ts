import Notification from "./notification";
import { User } from "../../user/user.model";
import Game from "../../game/classes/game";
import { GameInviteNotification } from "@shared/notifications";

export default class GameInvite extends Notification {
  public readonly game: Game;

  constructor(inviter: User, invitee: User, game: Game) {
    super(
      "game_invite",
      inviter,
      invitee
    );

    this.game = game;
  }

  public toINotification(): GameInviteNotification {
    return {
      ...super.toINotification(),
      gameId: this.game.id,
    }
  }
}