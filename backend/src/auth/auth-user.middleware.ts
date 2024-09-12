import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { NextFunction, Response } from 'express';
import {Request} from "../app";
import {TokenPayload} from "./auth";

@Injectable()
export class AuthUserMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {
  }

  async use(req: Request, _: Response, next: NextFunction) {
    const token = this.authService.extractTokenFromRequest(req);

    delete req.user;
    if (token) {
      try {
        req.user = await this.jwtService.verifyAsync(token) as TokenPayload;
      } catch (_) {
        // ignored
      }
    }

    next();
  }
}