import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {WsException} from '@nestjs/websockets';
import {SocketType} from "../game/game";

@Injectable()
export class WsAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const client: SocketType = context.switchToWs().getClient();

        if (client.data.user?.id)
            return true;

        throw new WsException('Aby to zrobić, musisz być zalogowany');
    }
}
