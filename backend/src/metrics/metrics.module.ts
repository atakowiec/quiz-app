import { Module } from "@nestjs/common";
import { MetricsService } from "./services/metrics.service";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import { Counter, Gauge } from "prom-client";

@Module({
  imports: [PrometheusModule.register()],
  providers: [
    MetricsService,
    {
      provide: "PROM_METRIC_GAMES_CREATED_TOTAL",
      useValue: new Counter({
        name: "games_created_total",
        help: "Total number of games created",
      }),
    },
    {
      provide: "PROM_METRIC_GAMES_ACTIVE_TOTAL",
      useValue: new Gauge({
        name: "games_active_total",
        help: "Total number of active games",
      }),
    },
  ],
  exports: [MetricsService],
})
export class MetricsModule {}
