import { Test, TestingModule } from '@nestjs/testing';
import { WeatherStationService } from './weather-station.service';
import { WeatherStationRepository } from '../domain/weather-station.repository';

describe('WeatherStationService', () => {
  let service: WeatherStationService;

  const mockRepo = {
    save: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherStationService,
        {
          provide: WeatherStationRepository,
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<WeatherStationService>(WeatherStationService);
  });

  // ---------------- CREATE ----------------
  describe('create', () => {
    it('should create and save a weather station', async () => {
      const dto = {
        name: 'Station A',
        location: { latitude: 10, longitude: 20 },
        sensorModel: 'X1',
        state: 'ACTIVE',
        ownerId: 'owner1',
      };

      jest.mock('../../measurement/domain/valueObjects/Location', () => ({
        Location: {
          create: jest.fn(() => ({ lat: 10, lng: 20 })),
        },
      }));

      const result = await service.create(dto as any);

      expect(mockRepo.save).toHaveBeenCalled();
      expect(result.name).toBe('Station A');
    });
  });

  // ---------------- UPDATE ----------------
  describe('update', () => {
    it('should update weather station fields', async () => {
      const existing = {
        name: 'Old',
        location: { lat: 1, lng: 1 },
        sensorModel: 'A',
        state: 'ACTIVE',
      };

      mockRepo.findById.mockResolvedValue(existing);
      mockRepo.update.mockResolvedValue(undefined);

      const result = await service.update('ws1', {
        name: 'New Name',
        sensorModel: 'B',
        state: 'INACTIVE',
      } as any);

      expect(mockRepo.findById).toHaveBeenCalledWith('ws1');
      expect(mockRepo.update).toHaveBeenCalledWith('ws1', existing);
      expect(result.name).toBe('New Name');
      expect(result.sensorModel).toBe('B');
    });

    it('should throw if station not found', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.update('ws1', { name: 'X' } as any)).rejects.toThrow(
        'Weather Station not found',
      );
    });

    it('should update only provided fields', async () => {
      const existing = {
        name: 'Old',
        sensorModel: 'A',
        state: 'ACTIVE',
      };

      mockRepo.findById.mockResolvedValue(existing);
      mockRepo.update.mockResolvedValue(undefined);

      await service.update('ws1', {
        name: 'Updated',
      } as any);

      expect(existing.name).toBe('Updated');
      expect(existing.sensorModel).toBe('A');
    });
  });

  // ---------------- DELETE ----------------
  describe('delete', () => {
    it('should call repository delete', async () => {
      mockRepo.delete.mockResolvedValue({ id: 'ws1' });

      const result = await service.delete('ws1');

      expect(mockRepo.delete).toHaveBeenCalledWith('ws1');
      expect(result).toEqual({ id: 'ws1' });
    });
  });
});
