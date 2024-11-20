import { Test, TestingModule } from '@nestjs/testing';
import { ColorsController } from './colors.controller';

describe('ColorsController', () => {
  let controller: ColorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColorsController],
    }).compile();

    controller = module.get<ColorsController>(ColorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
