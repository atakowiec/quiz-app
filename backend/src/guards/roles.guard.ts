import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles, RolesEnum } from "./roles.decorator";
import { Request } from "../app";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const client: Request = context.switchToHttp().getRequest();
    return this.matchRoles(roles, client.user?.permission);
  }

  private matchRoles(roles: RolesEnum[], permission: number | undefined) {
    return roles.some((role) => role.valueOf() === permission);
  }
}
