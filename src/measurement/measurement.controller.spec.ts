import { Test, TestingModule } from '@nestjs/testing';
import { MeasurementController } from './measurement.controller';
import { MeasurementService } from './application/measurement.service';

describe('MeasurementController', () => {
  let controller: MeasurementController;

  const mockMeasurementService = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByStationName: jest.fn(),
    filterByTemperatureRange: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeasurementController],
      providers: [
        {
          provide: MeasurementService,
          useValue: mockMeasurementService,
        },
      ],
    }).compile();

    controller = module.get<MeasurementController>(MeasurementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});