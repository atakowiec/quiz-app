import { Test, TestingModule } from "@nestjs/testing";
import { RoundService } from "./services/round.service";

describe("RoundService", () => {
  let service: RoundService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoundService],
    }).compile();

    service = module.get<RoundService>(RoundService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
