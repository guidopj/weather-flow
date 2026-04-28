import { Humidity } from '../valueObjets/humidity';
import { Temperature, TemperatureUnit } from '../valueObjets/temperature';
import { AlertType } from './AlertTypes';
import { Measurement } from './measurement';

describe('Measurement', () => {
  it('should detect heat wave', () => {
    const m = Measurement.create({
      weatherStationId: 'WS1',
      temperature: Temperature.create(45, TemperatureUnit.CELSIUS),
      humidity: Humidity.create(50),
      atmosphericPressure: 1000,
    });

    expect(m.alarmType).toBe(AlertType.HEAT_WAVE);
  });

  it('should detect frost', () => {
    const m = Measurement.create({
      weatherStationId: 'WS1',
      temperature: Temperature.create(-5, TemperatureUnit.CELSIUS),
      humidity: Humidity.create(50),
      atmosphericPressure: 1000,
    });

    expect(m.alarmType).toBe(AlertType.FROST);
  });

  it('should detect low pressure', () => {
    const m = Measurement.create({
      weatherStationId: 'WS1',
      temperature: Temperature.create(20, TemperatureUnit.CELSIUS),
      humidity: Humidity.create(50),
      atmosphericPressure: 900,
    });

    expect(m.alarmType).toBe(AlertType.LOW_PRESSURE);
  });

  it('should detect low pressure', () => {
    const m = Measurement.create({
      weatherStationId: 'WS1',
      temperature: Temperature.create(20, TemperatureUnit.CELSIUS),
      humidity: Humidity.create(50),
      atmosphericPressure: 900,
    });

    expect(m.alarmType).toBe(AlertType.LOW_PRESSURE);
  });

  it('should detect high humidity', () => {
    const m = Measurement.create({
      weatherStationId: 'WS1',
      temperature: Temperature.create(20, TemperatureUnit.CELSIUS),
      humidity: Humidity.create(95),
      atmosphericPressure: 1000,
    });

    expect(m.alarmType).toBe(AlertType.HIGH_HUMIDITY);
  });

  it('should return NONE when normal', () => {
    const m = Measurement.create({
      weatherStationId: 'WS1',
      temperature: Temperature.create(20, TemperatureUnit.CELSIUS),
      humidity: Humidity.create(50),
      atmosphericPressure: 1000,
    });

    expect(m.alarmType).toBe(AlertType.NONE);
  });

  //VALIDATIONS

  it('should throw if temperature is too high', () => {
    expect(() =>
      Measurement.create({
        weatherStationId: 'WS1',
        temperature: Temperature.create(80, TemperatureUnit.CELSIUS),
        humidity: Humidity.create(50),
        atmosphericPressure: 1000,
      }),
    ).toThrow();
  });

  it('should throw if humidity invalid', () => {
    expect(() =>
      Measurement.create({
        weatherStationId: 'WS1',
        temperature: Temperature.create(20, TemperatureUnit.CELSIUS),
        humidity: Humidity.create(200),
        atmosphericPressure: 1000,
      }),
    ).toThrow();
  });

  it('should mark anomaly when alarm exists', () => {
    const m = Measurement.create({
      weatherStationId: 'WS1',
      temperature: Temperature.create(45, TemperatureUnit.CELSIUS),
      humidity: Humidity.create(50),
      atmosphericPressure: 1000,
    });

    expect(m.isAnomaly).toBe(true);
  });
});
