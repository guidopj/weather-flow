import { Injectable } from '@nestjs/common';
import { MeasurementRepository } from '../domain/measurement.repository';
import { AlarmType } from 'src/types/measurement.types';
import { Measurement } from '../domain/measurement';
import { WeatherStationRepository } from 'src/weather-station/domain/weather-station.repository';

@Injectable()
export class MeasurementService {
  constructor(
    private readonly measurementRepo: MeasurementRepository,
    private readonly weatherStationRepo: WeatherStationRepository,
  ) {}

  async findByStationName(name: string): Promise<Measurement[]> {
    const station = await this.weatherStationRepo.findByName(name);

    if (!station) return [];

    return this.measurementRepo.findByStationId(station.id);
  }

  async create(input: {
    weatherStationId: string;
    timestamp: Date;
    temperature: number;
    humidity: number;
    atmosphericPressure: number;
    alarmType: AlarmType;
  }) {
    // 1. crear entidad de dominio
    const measurement = new Measurement(
      input.weatherStationId,
      input.timestamp,
      input.temperature,
      input.humidity,
      input.atmosphericPressure,
      input.alarmType,
    );

    // 2. persistir usando puerto
    await this.measurementRepo.save(measurement);

    return measurement;
  }
}
