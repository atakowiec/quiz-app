import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { NextFunction, Response } from "express";
import { Request } from "../app";
import { TokenPayload } from "./auth";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthUserMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthUserMiddleware.name);

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // im not sure if this whole logic is needed here - a lot of edge cases

    if (!this.authService.extractTokenFromRequest(req)) {
      next();
      return;
    }

    try {
      const user = this.authService.extractTokenPayloadFromRequest(
        req
      ) as TokenPayload;

      this.logger.log(
        `[${req.baseUrl}] Validating incoming token for user ${user.username}`
      );

      if (user.id) {
        // the user is logged in - find the user in the db
        const dbUser = await this.userService.repository.findOne({
          where: { id: user.id },
        });

        if (!dbUser) {
          // the user has token of a non-existing user
          this.logger.warn(
            `User with id ${user.id} not found in the database - removing token.`
          );
          this.authService.clearTokenFromResponse(res);
        } else {
          this.logger.log(
            `User [ID:${dbUser.id}] ${dbUser.username} found in the database.`
          );
          req.user = dbUser;
        }
      } else {
        this.logger.log(`User ${user.username} is not logged in.`);
        // the user is not logged in but has a token propably with username
        req.user = {
          username: user.username,
        };
      }
    } catch (_) {
      this.logger.warn(
        "Invalid token received. token: " + req.cookies.access_token
      );
      // delete token from the response if it's invalid
      this.authService.clearTokenFromResponse(res);
    }

    next();
  }
}
