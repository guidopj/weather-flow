import { Injectable, NotFoundException } from '@nestjs/common';

import { WeatherStationRepository } from '../../weather-station/domain/weather-station.repository';
import { MeasurementRepository } from '../domain/measurement.repository';
import { UserRepository } from '../../user/domain/user-repository';

import { NotificationService } from '../../notifications/application/notificationService';

import { UpdateMeasurementDto } from '../update-measurement.dto';

import { Measurement } from '../domain/measurement';
import { TemperatureRange } from '../domain/valueObjects/TemperatureRange';

@Injectable()
export class MeasurementService {
  constructor(
    private readonly measurementRepo: MeasurementRepository,
    private readonly weatherStationRepo: WeatherStationRepository,
    private readonly userRepo: UserRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async create(input: {
    weatherStationId: string;
    temperature: number;
    humidity: number;
    atmosphericPressure: number;
  }): Promise<Measurement> {
    const station = await this.weatherStationRepo.findById(
      input.weatherStationId,
    );

    if (!station) {
      throw new NotFoundException('weather station not found');
    }

    const measurement = Measurement.create(input);

    await this.measurementRepo.create(measurement);

    if (measurement.isAnomaly) {
      const users = await this.userRepo.findBySubscribedStation(
        input.weatherStationId,
      );

      for (const user of users) {
        this.notificationService.notify(
          user.email,
          `Alert: ${measurement.alarmType} detected to User: ${user.name}`,
        );
      }
    }

    return measurement;
  }

  async update(measurementId: string, input: UpdateMeasurementDto) {
    const measurement: Measurement | null =
      await this.measurementRepo.findById(measurementId);
    if (!measurement) throw new NotFoundException('Measurement not found');

    if (input.atmosphericPressure)
      measurement.atmosphericPressure = input.atmosphericPressure;
    if (input.humidity) measurement.humidity = input.humidity;
    if (input.temperature) measurement.temperature = input.temperature;

    await this.measurementRepo.update(measurementId, measurement);

    return measurement;
  }

  async delete(id: string) {
    await this.measurementRepo.delete(id);
  }

  async findByStationName(weatherStationName: string): Promise<Measurement[]> {
    const weatheStation =
      await this.weatherStationRepo.findByName(weatherStationName);

    if (!weatheStation) return [];

    return this.measurementRepo.findByStationId(weatheStation.id);
  }

  async getHistory(filters: {
    weatherStationId?: string;
    min?: number;
    max?: number;
    onlyAnomalies?: boolean;
  }): Promise<Measurement[]> {
    const temperatureRange =
      filters.min !== undefined && filters.max !== undefined
        ? new TemperatureRange(filters.min, filters.max)
        : undefined;

    return this.measurementRepo.getAllByCriteria({
      weatherStationId: filters.weatherStationId,
      temperatureRange,
      isActive: filters.onlyAnomalies
    });
  }

  async filterByTemperatureRange(
    min?: number,
    max?: number,
    isActive?: boolean,
  ): Promise<Measurement[]> {
    return this.getHistory({
      min,
      max,
      onlyAnomalies: isActive,
    });
  }
}
