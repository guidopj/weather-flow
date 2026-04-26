import { WeatherStation } from '../../weather-station/domain/weatherStation';
import { User } from '../../user/domain/user';
import { MeasurementService } from '../../measurement/application/measurement.service';

describe('Integration - create measurement and notify users', () => {
  it('should notify correct users based on subscriptions', async () => {
    // Users
    const u1 = new User('A', 'A', 'a@mail.com');
    const u2 = new User('B', 'B', 'b@mail.com');
    const u3 = new User('C', 'C', 'c@mail.com');

    u1.subscribe('WS1');
    u1.subscribe('WS2');
    u2.subscribe('WS3');

    // Weather Stations
    const ws1 = new WeatherStation(
      'S1',
      {} as any,
      'model',
      true,
      'owner1',
      'WS1',
    );
    const ws2 = new WeatherStation(
      'S2',
      {} as any,
      'model',
      true,
      'owner1',
      'WS2',
    );
    const ws3 = new WeatherStation(
      'S3',
      {} as any,
      'model',
      true,
      'owner2',
      'WS3',
    );

    const users = [u1, u2, u3];
    const stations = [ws1, ws2, ws3];

    const userRepo = {
      findBySubscribedStation: async (stationId: string) =>
        users.filter((u) => u.subscriptionAlerts.includes(stationId)),
    };

    const weatherStationRepo = {
      findById: async (id: string) => stations.find((s) => s.id === id) ?? null,
    };

    const measurementRepo = {
      create: async () => {},
    };

    const notifications: Array<{ email: string; message: string }> = [];

    const notificationService = {
      notify: async (email: string, message: string) => {
        notifications.push({ email, message });
      },
    };

    const service = new MeasurementService(
      measurementRepo as any,
      weatherStationRepo as any,
      userRepo as any,
      notificationService as any,
    );

    await service.create({
      weatherStationId: 'WS1',
      temperature: 45, // HEAT_WAVE
      humidity: 50,
      atmosphericPressure: 1000,
    });

    await service.create({
      weatherStationId: 'WS2',
      temperature: -5, // FROST
      humidity: 50,
      atmosphericPressure: 1000,
    });

    await service.create({
      weatherStationId: 'WS3',
      temperature: 20,
      humidity: 95, // HIGH_HUMIDITY
      atmosphericPressure: 1000,
    });

    expect(notifications).toHaveLength(3);

    expect(notifications).toEqual([
      expect.objectContaining({
        email: 'a@mail.com',
        message: expect.stringContaining('HEAT_WAVE'),
      }),
      expect.objectContaining({
        email: 'a@mail.com',
        message: expect.stringContaining('FROST'),
      }),
      expect.objectContaining({
        email: 'b@mail.com',
        message: expect.stringContaining('HIGH_HUMIDITY'),
      }),
    ]);
  });
});
