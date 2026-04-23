import { WeatherStationRepositoryMongo } from './weather-station.repository.mongo';
import { WeatherStation } from '../domain/weatherStation';

describe('WeatherStationRepositoryMongo', () => {
  let repo: WeatherStationRepositoryMongo;

  const mockModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    repo = new WeatherStationRepositoryMongo(mockModel as any);
  });

  // ---------------- CREATE ----------------
  it('should normalize name and save weather station', async () => {
    const weatherStation = new WeatherStation(
      '  Weather Station 1 ',
      { lat: 10, lng: 20 } as any,
      'MODEL',
      true,
      'owner1',
    );

    mockModel.create.mockResolvedValue({
      _id: 'id1',
      name: 'weather station 1',
      location: { lat: 10, lng: 20 },
      sensorModel: 'MODEL',
      state: true,
      ownerId: 'owner1',
    });

    await repo.create(weatherStation);

    expect(mockModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'weather station 1',
      }),
    );
  });

  // ---------------- FIND BY NAME ----------------
  it('should normalize input name and find station', async () => {
    mockModel.findOne.mockResolvedValue({
      _id: 'id1',
      name: 'weather station 1',
      location: { lat: 10, lng: 20 },
      sensorModel: 'MODEL',
      state: true,
      ownerId: 'owner1',
    });

    const result = await repo.findByName('  WEATHER   station 1 ');

    expect(mockModel.findOne).toHaveBeenCalledWith({
      name: 'weather station 1',
    });

    expect(result?.id).toBe('id1');
    expect(result?.station.name).toBe('weather station 1');
  });

  // ---------------- UPDATE ----------------
  it('should update and return domain object', async () => {
    mockModel.findByIdAndUpdate.mockResolvedValue({
      _id: 'id1',
      name: 'weather station 1',
      location: { lat: 10, lng: 20 },
      sensorModel: 'MODEL',
      state: true,
      ownerId: 'owner1',
    });

    const ws = new WeatherStation(
      'Weather Station 1',
      { lat: 10, lng: 20 } as any,
      'MODEL',
      true,
      'owner1',
    );

    const result = await repo.update('id1', ws);

    expect(mockModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(result?.name).toBe('weather station 1');
  });

  // ---------------- DELETE ----------------
  it('should delete by id', async () => {
  mockModel.findByIdAndDelete.mockResolvedValue({
    _id: 'id1',
    name: 'weather station 1',
    location: { lat: 10, lng: 20 },
    sensorModel: 'MODEL',
    state: true,
    ownerId: 'owner1',
  });

  const result = await repo.delete('id1');

  expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith('id1');
  expect(result?.name).toBe('weather station 1');
});

  // ---------------- FIND BY ID ----------------
  it('should return domain object by id', async () => {
    mockModel.findById.mockResolvedValue({
      _id: 'id1',
      name: 'weather station 1',
      location: { lat: 10, lng: 20 },
      sensorModel: 'MODEL',
      state: true,
      ownerId: 'owner1',
    });

    const result = await repo.findById('id1');

    expect(mockModel.findById).toHaveBeenCalledWith('id1');
    expect(result?.name).toBe('weather station 1');
  });
});