import { Test, TestingModule } from '@nestjs/testing';

import { MeasurementService } from './measurement.service';
import { MeasurementRepository } from '../domain/measurement.repository';
import { WeatherStationRepository } from '../../weather-station/domain/weather-station.repository';
import { UserRepository } from '../../user/domain/user-repository';
import { NotificationService } from '../../notifications/application/notificationService';

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

  const mockUserRepo = {
    findBySubscribedStation: jest.fn(),
  };

  const mockNotificationService = {
    notify: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeasurementService,
        { provide: MeasurementRepository, useValue: mockMeasurementRepo },
        { provide: WeatherStationRepository, useValue: mockWeatherStationRepo },
        { provide: UserRepository, useValue: mockUserRepo },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    service = module.get<MeasurementService>(MeasurementService);
  });

  // ---------------- CREATE ----------------
  describe('create', () => {
    it('should create measurement when station exists', async () => {
      mockWeatherStationRepo.findById.mockResolvedValue({ id: 'WS1' });

      jest.spyOn(Measurement, 'create').mockReturnValue({
        id: 'm1',
        weatherStationId: 'WS1',
      } as any);

      const result = await service.create({
        weatherStationId: 'WS1',
        temperature: 20,
        humidity: 50,
        atmosphericPressure: 1000,
      });

      expect(mockWeatherStationRepo.findById).toHaveBeenCalledWith('WS1');
      expect(mockMeasurementRepo.create).toHaveBeenCalled();
      expect(result.weatherStationId).toBe('WS1');
    });

    it('should throw if station not found', async () => {
      mockWeatherStationRepo.findById.mockResolvedValue(null);

      await expect(
        service.create({
          weatherStationId: 'WS1',
          temperature: 20,
          humidity: 50,
          atmosphericPressure: 1000,
        }),
      ).rejects.toThrow('weather station not found');
    });
  });

  // ---------------- UPDATE ----------------
  describe('update', () => {
    it('should update measurement', async () => {
      mockMeasurementRepo.findById.mockResolvedValue({
        id: 'm1',
        temperature: 20,
      });

      mockMeasurementRepo.update.mockResolvedValue(undefined);

      const result = await service.update('m1', {
        temperature: 30,
      } as any);

      expect(mockMeasurementRepo.findById).toHaveBeenCalledWith('m1');
      expect(mockMeasurementRepo.update).toHaveBeenCalled();
      expect(result.temperature).toBe(30);
    });

    it('should throw if measurement not found', async () => {
      mockMeasurementRepo.findById.mockResolvedValue(null);

      await expect(
        service.update('m1', { temperature: 20 } as any),
      ).rejects.toThrow('Measurement not found');
    });
  });

  // ---------------- DELETE ----------------
  describe('delete', () => {
    it('should call repository delete', async () => {
      await service.delete('m1');

      expect(mockMeasurementRepo.delete).toHaveBeenCalledWith('m1');
    });
  });

  // ---------------- HISTORY / FILTER ----------------
  describe('getHistory', () => {
    it('should call repo with correct filters (station + anomaly)', async () => {
      mockMeasurementRepo.getAllByCriteria.mockResolvedValue([
        {
          weatherStationId: 'WS1',
          temperature: 45,
          isAnomaly: true,
        },
      ]);

      const result = await service.getHistory({
        weatherStationId: 'WS1',
        onlyAnomalies: true,
      });

      expect(mockMeasurementRepo.getAllByCriteria).toHaveBeenCalledWith({
        weatherStationId: 'WS1',
        temperatureRange: undefined,
        isActive: true,
      });

      expect(result).toHaveLength(1);
    });

    it('should call repo with temperature range filters', async () => {
      mockMeasurementRepo.getAllByCriteria.mockResolvedValue([
        {
          weatherStationId: 'WS1',
          temperature: 20,
        },
      ]);

      const result = await service.getHistory({
        min: 10,
        max: 30,
        onlyAnomalies: false,
      });

      expect(mockMeasurementRepo.getAllByCriteria).toHaveBeenCalledWith({
        weatherStationId: undefined,
        temperatureRange: expect.any(Object),
        isActive: false,
      });

      expect(result).toHaveLength(1);
    });
  });

  // ---------------- NOTIFICATIONS ----------------
  describe('create - anomalies', () => {
    it('should notify users when anomaly exists', async () => {
      mockWeatherStationRepo.findById.mockResolvedValue({ id: 'WS1' });

      jest.spyOn(Measurement, 'create').mockReturnValue({
        id: 'm1',
        weatherStationId: 'WS1',
        isAnomaly: true,
        alarmType: 'HEAT_WAVE',
      } as any);

      mockUserRepo.findBySubscribedStation.mockResolvedValue([
        { email: 'test@mail.com', name: 'A' },
      ]);

      await service.create({
        weatherStationId: 'WS1',
        temperature: 50,
        humidity: 50,
        atmosphericPressure: 1000,
      });

      expect(mockNotificationService.notify).toHaveBeenCalled();
    });
  });
});