import { Test, TestingModule } from '@nestjs/testing';
import { WeatherStationController } from './weather-station.controller';

describe('WeatherStationController', () => {
  let controller: WeatherStationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherStationController],
    }).compile();

    controller = module.get<WeatherStationController>(WeatherStationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
