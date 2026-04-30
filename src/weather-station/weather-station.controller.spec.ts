import { Test, TestingModule } from '@nestjs/testing';
import { WeatherStationController } from './weather-station.controller';
import { WeatherStationService } from './application/weather-station.service';

describe('WeatherStationController', () => {
  let controller: WeatherStationController;

  const mockWeatherStationService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherStationController],
      providers: [
        {
          provide: WeatherStationService,
          useValue: mockWeatherStationService,
        },
      ],
    }).compile();

    controller = module.get<WeatherStationController>(WeatherStationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});