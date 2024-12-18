import { SocketType } from "../game.types";
import { GameService } from "../services/game.service";

export enum HelperEnum {
  FiftyFifty = "fifty_fifty",
  ExtendTime = "extend_time",
  CheatFromOthers = "cheat_from_others",
}

abstract class Helper {
  name: HelperEnum;

  constructor(name: HelperEnum) {
    this.name = name;
  }

  abstract execute(socket: SocketType, gameService: GameService): void;
}

class FifyFifty extends Helper {
  constructor() {
    super(HelperEnum.FiftyFifty);
  }

  execute(socket: SocketType, gameService: GameService) {
    gameService.getGameByUsername(socket.data.username)?.fiftyFifty(socket);
  }
}

class ExtendTime extends Helper {
  constructor() {
    super(HelperEnum.ExtendTime);
  }

  execute(socket: SocketType, gameService: GameService) {
    gameService.getGameByUsername(socket.data.username)?.extendTime(socket);
  }
}

class CheatFromOthers extends Helper {
  constructor() {
    super(HelperEnum.CheatFromOthers);
  }

  execute(socket: SocketType, gameService: GameService) {
    gameService.getGameByUsername(socket.data.username)?.cheatFromOthers(socket);
  }
}

export default Helper;
export { FifyFifty, ExtendTime, CheatFromOthers };
