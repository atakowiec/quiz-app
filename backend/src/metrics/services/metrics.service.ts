import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Counter, Gauge } from "prom-client";
import { InjectMetric } from "@willsoto/nestjs-prometheus";

@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly logger = new Logger(MetricsService.name);
  private lastKnownValues = {
    gamesCreated: 0,
    gamesFinished: 0,
  };

  constructor(
    @InjectMetric("games_created_total")
    private readonly gamesCreatedCounter: Counter<string>,
    @InjectMetric("games_active_total")
    private readonly activeGamesGauge: Gauge<string>,
    @InjectMetric("games_finished_total")
    private readonly gamesFinishedCounter: Counter<string>
  ) {}

  async onModuleInit() {
    try {
      this.logger.log("Restoring metrics from Prometheus");
      const response = await fetch("http://prometheus:9090/api/v1/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          query: "games_created_total",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data.result && data.data.result[0]) {
          this.lastKnownValues.gamesCreated = Number(
            data.data.result[0].value[1]
          );
          this.gamesCreatedCounter.inc(this.lastKnownValues.gamesCreated);

          this.logger.log(
            "Restored games created total: " + this.lastKnownValues.gamesCreated
          );
        }
      }

      const finishedResponse = await fetch(
        "http://prometheus:9090/api/v1/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            query: "games_finished_total",
          }),
        }
      );

      if (finishedResponse.ok) {
        const data = await finishedResponse.json();
        if (data.data.result && data.data.result[0]) {
          this.lastKnownValues.gamesFinished = Number(
            data.data.result[0].value[1]
          );
          this.gamesFinishedCounter.inc(this.lastKnownValues.gamesFinished);
        }
      }
    } catch (error) {
      this.logger.error("Failed to restore metrics from Prometheus", error);
      this.logger.error(error.message);
    }
  }

  incrementGameCreated() {
    this.gamesCreatedCounter.inc();
    this.lastKnownValues.gamesCreated++;
  }

  setActiveGamesCount(count: number) {
    this.activeGamesGauge.set(count);
  }

  incrementGameFinished() {
    this.gamesFinishedCounter.inc();
    this.lastKnownValues.gamesFinished++;
  }
}
