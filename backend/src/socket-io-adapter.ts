import { INestApplicationContext, UnauthorizedException } from "@nestjs/common";
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
  private readonly authService: AuthService;
  private readonly userService: UserService;
  private readonly colorsService: ColorsService;

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
    const clientPort = parseInt(this.configService.get("CLIENT_PORT"), 10);

    const cors: CorsOptions = {
      credentials: true,
      origin: [
        this.configService.get("CLIENT_URL"),
        `http://localhost:${clientPort}`,
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

  private createTokenMiddleware() {
    return async (socket: SocketType, next: NextFunction) => {
      const cookie = socket.handshake.headers.cookie;

      if (!cookie) {
        return next(new UnauthorizedException("Nie podano ciasteczka"));
      }

      try {
        const user = this.authService.extractTokenPayloadFromSocket(socket);
        if (user && user.id) {
          const dbUser = await this.userService.repository.findOne({
            where: { id: user.id },
          });

          if (!dbUser) {
            this.authService.clearTokenFromSocket(socket);
            return next(new UnauthorizedException("Użytkownik nie internist"));
          }
          socket.data = {
            user: dbUser,
            username: dbUser.username,
            iconColor: dbUser.iconColor || this.colorsService.getRandomColor(),
          };
        } else {
          socket.data = {
            username: user.username,
            iconColor: this.colorsService.getRandomColor(),
          };
        }
        next();
      } catch (error) {
        next(new UnauthorizedException("Niepoprawny token"));
      }
    };
  }
}
