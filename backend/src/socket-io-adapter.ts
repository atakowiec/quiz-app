import {
  INestApplicationContext,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server, ServerOptions } from "socket.io";
import { SocketType } from "./game/game.types";
import { NextFunction } from "express";
import { CorsOptions } from "cors";
import { AuthService } from "./auth/auth.service";
import { UserService } from "./user/user.service";
import { ColorsService } from "./colors/colors.service";

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  private authService: AuthService;
  private userService: UserService;
  private colorsService: ColorsService;

  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService
  ) {
    super(app);

    this.authService = this.app.get(AuthService);
    this.userService = this.app.get(UserService);
    this.colorsService = this.app.get(ColorsService);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const clientPort = parseInt(this.configService.get("CLIENT_PORT"));

    const cors: CorsOptions = {
      credentials: true,
      origin: [
        this.configService.get("CLIENT_URL"),
        `http://localhost:${clientPort}`,
        new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
      ],
    };

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };

    const server: Server = super.createIOServer(port, optionsWithCORS);

    server.use(this.createTokenMiddleware());
    return server;
  }

  createTokenMiddleware() {
    return async (socket: SocketType, next: NextFunction) => {
      this.logger.log("Middleware for socket.io connection");
      if (!socket.handshake.headers.cookie) {
        return next(new UnauthorizedException("No auth cookie provided"));
      }
      try {
        const user = this.authService.extractTokenPayloadFromSocket(socket);

        if (user.id) {
          const dbUser = await this.userService.repository.findOne({
            where: { id: user.id },
          });

          if (!dbUser) {
            this.logger.warn(`User with id ${user.id} not found in the database - removing token.`);
            this.authService.clearTokenFromSocket(socket);
            return next(new UnauthorizedException("User not found"));
          } else {
            this.logger.log(`User [ID:${dbUser.id}] ${dbUser.username} found in the database.`);
            socket.data = {
              user: dbUser,
              username: dbUser.username,
              iconColor: dbUser.iconColor || this.colorsService.getRandomColor(),
            };
          }
        } else {
          this.logger.log(`User ${user.username} has no account.`);
          socket.data = {
            username: user.username,
            iconColor: this.colorsService.getRandomColor(),
          };
        }
        next();
      } catch (error) {
        this.logger.error("Error in token middleware:", error);
        next(new UnauthorizedException("Invalid token"));
      }
    };
  }
}