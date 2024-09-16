import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";
import { SocketIOAdapter } from "./socket-io-adapter";
import { log } from "console";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const clientPort = parseInt(configService.get("CLIENT_PORT")) || 5173;
  const port = parseInt(configService.get("SERVER_PORT")) || 3000;
  app.enableCors({
    origin: [
      `http://localhost:${clientPort}`,
      new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
    ],
  });

  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      enableDebugMessages: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => ({
          field: error.property,
          error: Object.values(error.constraints)[0],
        }));

        return new BadRequestException(formattedErrors);
      },
    })
  );

  await app.listen(port);
}

bootstrap();
