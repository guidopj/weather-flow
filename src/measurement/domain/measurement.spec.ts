import { AlertType } from './AlertTypes';
import { Measurement } from './measurement';

describe('Measurement', () => {
  it('should detect heat wave', () => {
    const m = Measurement.create({
      weatherStationId: 'WS1',
      temperature: 45,
      humidity: 50,
      atmosphericPressure: 1000,
    });

    expect(m.alarmType).toBe(AlertType.HEAT_WAVE);
  });

  it('should detect frost', () => {
    const m = Measurement.create({
      weatherStationId: 'WS1',
      temperature: -5,
      humidity: 50,
      atmosphericPressure: 1000,
    });

    expect(m.alarmType).toBe(AlertType.FROST);
  });

  it('should detect low pressure', () => {
    const m = Measurement.create({
      weatherStationId: 'WS1',
      temperature: 20,
      humidity: 50,
      atmosphericPressure: 900,
    });

    expect(m.alarmType).toBe(AlertType.LOW_PRESSURE);
  });

  it('should detect low pressure', () => {
    const m = Measurement.create({
      weatherStationId: 'WS1',
      temperature: 20,
      humidity: 50,
      atmosphericPressure: 900,
    });

    expect(m.alarmType).toBe(AlertType.LOW_PRESSURE);
  });

  it('should detect high humidity', () => {
    const m = Measurement.create({
      weatherStationId: 'WS1',
      temperature: 20,
      humidity: 95,
      atmosphericPressure: 1000,
    });

    expect(m.alarmType).toBe(AlertType.HIGH_HUMIDITY);
  });

  it('should return NONE when normal', () => {
    const m = Measurement.create({
      weatherStationId: 'WS1',
      temperature: 20,
      humidity: 50,
      atmosphericPressure: 1000,
    });

    expect(m.alarmType).toBe(AlertType.NONE);
  });

  //VALIDATIONS

  it('should throw if temperature is too high', () => {
    expect(() =>
      Measurement.create({
        weatherStationId: 'WS1',
        temperature: 80,
        humidity: 50,
        atmosphericPressure: 1000,
      }),
    ).toThrow();
  });

  it('should throw if humidity invalid', () => {
    expect(() =>
      Measurement.create({
        weatherStationId: 'WS1',
        temperature: 20,
        humidity: 200,
        atmosphericPressure: 1000,
      }),
    ).toThrow();
  });

  it('should mark anomaly when alarm exists', () => {
    const m = Measurement.create({
      weatherStationId: 'WS1',
      temperature: 45,
      humidity: 50,
      atmosphericPressure: 1000,
    });

    expect(m.isAnomaly).toBe(true);
  });
});
