import { Injectable } from "@nestjs/common";
import { Counter, Gauge } from "prom-client";
import { InjectMetric } from "@willsoto/nestjs-prometheus";

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric("games_created_total")
    private readonly gamesCreatedCounter: Counter<string>,
    @InjectMetric("games_active_total")
    private readonly activeGamesGauge: Gauge<string>,
    @InjectMetric("games_finished_total")
    private readonly gamesFinishedCounter: Counter<string>
  ) {}

  incrementGameCreated() {
    this.gamesCreatedCounter.inc();
  }

  setActiveGamesCount(count: number) {
    this.activeGamesGauge.set(count);
  }

  incrementGameFinished() {
    this.gamesFinishedCounter.inc();
  }
}
