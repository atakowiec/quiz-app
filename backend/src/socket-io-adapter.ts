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

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);

  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const clientPort = parseInt(this.configService.get("CLIENT_PORT"));

    const cors: CorsOptions = {
      credentials: true,
      origin: [
        `http://localhost:${clientPort}`,
        new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
      ],
    };

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };

    const authService = this.app.get(AuthService);
    const userService = this.app.get(UserService);

    const server: Server = super.createIOServer(port, optionsWithCORS);

    server.use(createTokenMiddleware(authService, userService, this.logger));
    return server;
  }
}

const createTokenMiddleware =
  (authService: AuthService, userService: UserService, logger: Logger) =>
  async (socket: SocketType, next: NextFunction) => {
    logger.log("Middleware for socket.io connection");
    if (!socket.handshake.headers.cookie) {
      return next(new UnauthorizedException("No auth cookie provided"));
    }
    try {
      const user = authService.extractTokenPayloadFromSocket(socket);

      if (user.id) {
        const dbUser = await userService.repository.findOne({
          where: { id: user.id },
        });

        if (!dbUser) {
          logger.warn(
            `User with id ${user.id} not found in the database - removing token.`
          );
          authService.clearTokenFromSocket(socket);
          return next(new UnauthorizedException("User not found"));
        } else {
          logger.log(
            `User [ID:${dbUser.id}] ${dbUser.username} found in the database.`
          );
          socket.data = { ...socket.data, ...dbUser };
        }
      } else {
        logger.log(`User ${user.username} has no account.`);
        socket.data = { ...socket.data, ...{ username: user.username } };
      }
      next();
    } catch (error) {
      logger.error("Error in token middleware:", error);
      next(new UnauthorizedException("Invalid token"));
    }
  };
