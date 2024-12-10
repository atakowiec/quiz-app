import { Reflector } from "@nestjs/core";

export enum RolesEnum {
  USER = 0,
  ADMIN = 1,
}

export const Roles = Reflector.createDecorator<RolesEnum[]>();
