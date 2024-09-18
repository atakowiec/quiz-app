import {
  INestApplicationContext,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server, ServerOptions } from "socket.io";
import { SocketData, SocketType } from "./game/game.types";
import { NextFunction } from "express";
import { CorsOptions } from "cors";
import { log } from "console";
import { parse } from "cookie";

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
      credentials: true, // todo Łukasz musisz to dodać jak będziesz odpowiednio konfigurował socketio na backendzie  bez tego nie zadziała
      origin: [
        `http://localhost:${clientPort}`,
        new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
      ],
    };

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };

    const jwtService = this.app.get(JwtService);

    const server: Server = super.createIOServer(port, optionsWithCORS);

    server.use(createTokenMiddleware(jwtService, this.logger));
    return server;
  }
}

const createTokenMiddleware =
  (jwtService: JwtService, logger: Logger) =>
  (socket: SocketType, next: NextFunction) => {
    // For Postman Testing Purposes
    if (socket.handshake.headers["token"])
      socket.handshake.headers.cookie = `access_token=${socket.handshake.headers["token"]}`;

    if (!socket.handshake.headers.cookie) {
      return next(new UnauthorizedException("No auth cookie provided"));
    }
    const cookies = parse(socket.handshake.headers.cookie);
    try {
      const payload = jwtService.verify(cookies.access_token) as SocketData;
      socket.data = { ...socket.data, ...payload };
      next();
    } catch {
      next(new Error("FORBIDDEN"));
    }
  };
