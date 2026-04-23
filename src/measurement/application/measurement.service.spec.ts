import { Test, TestingModule } from '@nestjs/testing';
import { MeasurementService } from './measurement.service';
import { MeasurementRepository } from '../domain/measurement.repository';
import { WeatherStationRepository } from '../../weather-station/domain/weather-station.repository';
import { Measurement } from '../domain/measurement';

describe('MeasurementService', () => {
  let service: MeasurementService;

  const mockMeasurementRepo = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByStationId: jest.fn(),
    getAllByCriteria: jest.fn(),
  };

  const mockWeatherStationRepo = {
    findById: jest.fn(),
    findByName: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeasurementService,
        {
          provide: MeasurementRepository,
          useValue: mockMeasurementRepo,
        },
        {
          provide: WeatherStationRepository,
          useValue: mockWeatherStationRepo,
        },
      ],
    }).compile();

    service = module.get<MeasurementService>(MeasurementService);
  });

  // ---------------- CREATE ----------------
  describe('create', () => {
    it('should create measurement when station exists', async () => {
      mockWeatherStationRepo.findById.mockResolvedValue({ id: 'ws1' });

      jest.spyOn(Measurement, 'create').mockReturnValue({
        id: 'm1',
      } as any);

      const result = await service.create({
        weatherStationId: 'ws1',
        temperature: 20,
        humidity: 50,
        atmosphericPressure: 1000,
      });

      expect(mockWeatherStationRepo.findById).toHaveBeenCalledWith('ws1');
      expect(mockMeasurementRepo.create).toHaveBeenCalled();
      expect(result).toEqual({ id: 'm1' });
    });

    it('should throw if weather station not found', async () => {
      mockWeatherStationRepo.findById.mockResolvedValue(null);

      await expect(
        service.create({
          weatherStationId: 'ws1',
          temperature: 20,
          humidity: 50,
          atmosphericPressure: 1000,
        }),
      ).rejects.toThrow('Weather station not found');
    });
  });

  // ---------------- UPDATE ----------------
  describe('update', () => {
    it('should update measurement fully', async () => {
      const measurement = {
        atmosphericPressure: 1000,
        humidity: 50,
        temperature: 20,
      };

      mockMeasurementRepo.findById.mockResolvedValue(measurement);
      mockMeasurementRepo.update.mockResolvedValue(undefined);

      const result = await service.update('m1', {
        temperature: 25,
        humidity: 60,
        atmosphericPressure: 990,
      } as any);

      expect(mockMeasurementRepo.findById).toHaveBeenCalledWith('m1');
      expect(mockMeasurementRepo.update).toHaveBeenCalledWith('m1', measurement);
      expect(result.temperature).toBe(25);
      expect(result.humidity).toBe(60);
    });

    it('should throw if measurement not found', async () => {
      mockMeasurementRepo.findById.mockResolvedValue(null);

      await expect(
        service.update('m1', { temperature: 20 } as any),
      ).rejects.toThrow('Measurement not found');
    });

    it('should update only provided fields', async () => {
      const measurement = {
        temperature: 20,
        humidity: 50,
        atmosphericPressure: 1000,
      };

      mockMeasurementRepo.findById.mockResolvedValue(measurement);
      mockMeasurementRepo.update.mockResolvedValue(undefined);

      await service.update('m1', {
        temperature: 30,
      } as any);

      expect(measurement.temperature).toBe(30);
      expect(measurement.humidity).toBe(50);
    });
  });

  // ---------------- DELETE ----------------
  describe('delete', () => {
    it('should call repository delete', async () => {
      await service.delete('m1');

      expect(mockMeasurementRepo.delete).toHaveBeenCalledWith('m1');
    });
  });

  // ---------------- FIND BY STATION ----------------
  describe('findByStationName', () => {
    it('should return measurements when station exists', async () => {
      mockWeatherStationRepo.findByName.mockResolvedValue({ id: 'ws1' });
      mockMeasurementRepo.findByStationId.mockResolvedValue([{ id: 'm1' }]);

      const result = await service.findByStationName('Station A');

      expect(mockWeatherStationRepo.findByName).toHaveBeenCalledWith('Station A');
      expect(result).toEqual([{ id: 'm1' }]);
    });

    it('should return empty array when station not found', async () => {
      mockWeatherStationRepo.findByName.mockResolvedValue(null);

      const result = await service.findByStationName('Station A');

      expect(result).toEqual([]);
    });
  });

  // ---------------- FILTER ----------------
  describe('filterByTemperatureRange', () => {
    it('should call repo with range when min and max exist', async () => {
      mockMeasurementRepo.getAllByCriteria.mockResolvedValue([{ id: 'm1' }]);

      const result = await service.filterByTemperatureRange(10, 30, true);

      expect(mockMeasurementRepo.getAllByCriteria).toHaveBeenCalled();
      expect(result).toEqual([{ id: 'm1' }]);
    });

    it('should call repo without range if missing params', async () => {
      mockMeasurementRepo.getAllByCriteria.mockResolvedValue([]);

      await service.filterByTemperatureRange(undefined, undefined, false);

      const arg = mockMeasurementRepo.getAllByCriteria.mock.calls[0][0];

      expect(arg.temperatureRange).toBeUndefined();
      expect(arg.isActive).toBe(false);
    });
  });
});