import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from "@nestjs/common";
import { WsBadRequestException, WsUnknownException } from "./ws-exceptions";
import { SocketType } from "src/game/game.types";

@Catch()
export class WsCatchAllFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const socket: SocketType = host.switchToWs().getClient();

    if (exception instanceof BadRequestException) {
      const exceptionData = exception.getResponse();
      const exceptionMessage =
        exceptionData["message"] ?? exceptionData ?? exception.name;

      const wsException = new WsBadRequestException(exceptionMessage);
      socket.emit("exception", wsException.getError());
      return;
    }

    const wsException = new WsUnknownException(exception.message);
    socket.emit("exception", wsException.getError());
  }
}
