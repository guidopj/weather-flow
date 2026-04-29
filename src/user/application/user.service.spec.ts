import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../domain/user-repository';
import { Email } from '../domain/valueObjects/email';

describe('UserService', () => {
  let service: UserService;

  const mockRepo = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  // ---------------- CREATE ----------------
  describe('create', () => {
    it('should create and save user', async () => {
      const dto = {
        name: 'Guido',
        surname: 'Pujadas',
        email: 'guido@test.com',
        subscriptionAlerts: [],
      };

      const result = await service.create(dto as any);

      expect(mockRepo.create).toHaveBeenCalled();
      expect(result.name).toBe('Guido');
    });
  });

  // ---------------- UPDATE ----------------
  describe('update', () => {
    it('should update user fields', async () => {
      const user = {
        name: 'Guido-old',
        surname: 'Pujadas-old',
        email: Email.create('guidoOld@test.com'),
        subscriptionAlerts: [],
      };

      mockRepo.findById.mockResolvedValue(user);
      mockRepo.update.mockResolvedValue(undefined);

      const result = await service.update('u1', {
        name: 'Guido-new',
      } as any);

      expect(mockRepo.findById).toHaveBeenCalledWith('u1');
      expect(mockRepo.update).toHaveBeenCalledWith('u1', user);
      expect(result.name).toBe('Guido-new');
    });

    it('should throw if user not found', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.update('u1', { name: 'X' } as any)).rejects.toThrow(
        'User not found',
      );
    });
  });

  // ---------------- DELETE ----------------
  describe('delete', () => {
    it('should call repo delete', async () => {
      await service.delete('u1');

      expect(mockRepo.delete).toHaveBeenCalledWith('u1');
    });
  });

  // ---------------- SUBSCRIBE ----------------
  describe('subscribe', () => {
    it('should subscribe user to station', async () => {
      const user = {
        subscriptionAlerts: [],
        subscribe: jest.fn(),
      };

      mockRepo.findById.mockResolvedValue(user);
      mockRepo.update.mockResolvedValue(undefined);

      const result = await service.subscribe('u1', 'ws1');

      expect(user.subscribe).toHaveBeenCalledWith('ws1');
      expect(mockRepo.update).toHaveBeenCalled();
      expect(result).toBe(user);
    });

    it('should throw if user not found', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.subscribe('u1', 'ws1')).rejects.toThrow(
        'User not found',
      );
    });
  });

  // ---------------- UNSUBSCRIBE ----------------
  describe('unsubscribe', () => {
    it('should unsubscribe user from station', async () => {
      const user = {
        subscriptionAlerts: ['ws1'],
        unsubscribe: jest.fn(),
      };

      mockRepo.findById.mockResolvedValue(user);
      mockRepo.update.mockResolvedValue(undefined);

      const result = await service.unsubscribe('u1', 'ws1');

      expect(user.unsubscribe).toHaveBeenCalledWith('ws1');
      expect(mockRepo.update).toHaveBeenCalled();
      expect(result).toBe(user);
    });

    it('should throw if not subscribed', async () => {
      const user = {
        subscriptionAlerts: [],
        unsubscribe: jest.fn(),
      };

      mockRepo.findById.mockResolvedValue(user);

      await expect(service.unsubscribe('u1', 'ws1')).rejects.toThrow(
        'Weather station is not subscribed',
      );
    });

    it('should throw if user not found', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.unsubscribe('u1', 'ws1')).rejects.toThrow(
        'User not found',
      );
    });
  });
});
