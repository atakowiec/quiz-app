import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { WsException } from '@nestjs/websockets';
import { SocketType } from "../game/game.types";

@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const client: SocketType = context.switchToWs().getClient();

    if (client.data.user?.id)
      return true;

    throw new WsException('Aby to zrobić, musisz być zalogowany');
  }
}
