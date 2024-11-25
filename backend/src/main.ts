import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BadRequestException, Logger, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";
import { SocketIOAdapter } from "./socket-io-adapter";
import * as process from "node:process";
import { Counter } from "prom-client";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger("Bootstrap");

  const clientPort = parseInt(configService.get("CLIENT_PORT")) || 5173;
  const port = parseInt(configService.get("SERVER_PORT")) || 3000;

  app.enableCors({
    credentials: true,
    origin: [
      configService.get("CLIENT_URL"),
      `http://localhost:${clientPort}`,
      new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
    ],
  });

  app.enableShutdownHooks();
  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));
  app.use(cookieParser());

  const errorCounter = new Counter({
    name: "app_unhandled_errors_total",
    help: "Total number of unhandled errors",
    labelNames: ["type", "message"],
  });

  process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at:", promise, "reason:", reason);

    errorCounter.inc({
      type: "unhandledRejection",
      message: reason instanceof Error ? reason.message : String(reason),
    });
  });

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception thrown", error);

    errorCounter.inc({
      type: "uncaughtException",
      message: error.message,
    });
  });

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
  logger.log(`Application running on port ${port}`);
}

bootstrap();
