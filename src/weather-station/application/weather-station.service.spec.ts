import { Test, TestingModule } from '@nestjs/testing';
import { WeatherStationService } from './weather-station.service';
import { WeatherStationRepository } from '../domain/weather-station.repository';
import { UserRepository } from '../../user/domain/user-repository';

describe('WeatherStationService', () => {
  let service: WeatherStationService;

  const weatherStationMockRepo = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const userMockRepo = {
    findById: jest.fn(),
    create: jest.fn(),
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
          useValue: weatherStationMockRepo,
        },
        {
          provide: UserRepository,
          useValue: userMockRepo,
        },
      ],
    }).compile();

    service = module.get<WeatherStationService>(WeatherStationService);
  });

  // ---------------- CREATE ----------------
  describe('create', () => {
    const dto = {
      name: 'Station A',
      location: { latitude: 10, longitude: 20 },
      sensorModel: 'X1',
      state: 'ACTIVE',
      ownerId: 'owner1',
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create and save a weather station', async () => {
      userMockRepo.findById.mockResolvedValue({
        id: 'owner1',
        name: 'Guido',
      });

      const result = await service.create(dto as any);

      expect(userMockRepo.findById).toHaveBeenCalledWith('owner1');
      expect(weatherStationMockRepo.create).toHaveBeenCalled();
      expect(result.name).toBe('Station A');
    });

    it('should throw if user does not exist', async () => {
      
      userMockRepo.findById.mockResolvedValue(null);

      await expect(service.create(dto as any)).rejects.toThrow(
        'User not found',
      );

      expect(userMockRepo.findById).toHaveBeenCalledWith('owner1');
      expect(weatherStationMockRepo.create).not.toHaveBeenCalled();
    });

    
    it('should fail if ownerId is null', async () => {
      const badDto = {
        ...dto,
        ownerId: null,
      };

      await expect(service.create(badDto as any)).rejects.toThrow();
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

      weatherStationMockRepo.findById.mockResolvedValue(existing);
      weatherStationMockRepo.update.mockResolvedValue(undefined);

      const result = await service.update('ws1', {
        name: 'New Name',
        sensorModel: 'B',
        state: 'INACTIVE',
      } as any);

      expect(weatherStationMockRepo.findById).toHaveBeenCalledWith('ws1');
      expect(weatherStationMockRepo.update).toHaveBeenCalledWith(
        'ws1',
        existing,
      );
      expect(result.name).toBe('New Name');
      expect(result.sensorModel).toBe('B');
    });

    it('should throw if station not found', async () => {
      weatherStationMockRepo.findById.mockResolvedValue(null);

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

      weatherStationMockRepo.findById.mockResolvedValue(existing);
      weatherStationMockRepo.update.mockResolvedValue(undefined);

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
      weatherStationMockRepo.delete.mockResolvedValue({ id: 'ws1' });

      const result = await service.delete('ws1');

      expect(weatherStationMockRepo.delete).toHaveBeenCalledWith('ws1');
      expect(result).toEqual({ id: 'ws1' });
    });
  });
});
