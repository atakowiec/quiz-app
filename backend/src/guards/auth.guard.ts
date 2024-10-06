import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from "../app";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const client: Request = context.switchToHttp().getRequest()

    if (client.user?.id)
      return true;

    throw new ForbiddenException('Aby to zrobić, musisz być zalogowany');
  }
}
