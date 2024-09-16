import { INestApplicationContext, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server, ServerOptions } from "socket.io";
import { SocketData, SocketType } from "./game/game.types";
import { NextFunction } from "express";
import { CorsOptions } from "cors";

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

    // TODO: nie wiem dlaczego nie działa na namespace, już próbowałem z różnymi sposobami w gateway ustawiać tam namespace, i jak ustawiam namespace to nie działa cały websocket jest szansa ze to postmana wina bo własnie chyba tak samo mi się działo na kursie.
    //server.of("game").use(createTokenMiddleware(jwtService, this.logger));
    server.use(createTokenMiddleware(jwtService, this.logger));
    return server;
  }
}

const createTokenMiddleware =
  (jwtService: JwtService, logger: Logger) => (socket: SocketType, next: NextFunction) => {
    // for Postman testing support, fallback to token header

    // TODO: Zmienić na to ciasteczkowe mateusza, bo na razie przez postmana
    const token = socket.handshake.auth.token || socket.handshake.headers["token"];

    logger.debug(`Validating auth token before connection: ${token}`);

    try {
      const payload = jwtService.verify(token) as SocketData;
      socket.data = { ...socket.data, ...payload };

      next();
    } catch {
      next(new Error("FORBIDDEN"));
    }
  };
