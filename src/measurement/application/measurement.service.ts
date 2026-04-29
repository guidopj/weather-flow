import { Injectable, NotFoundException } from '@nestjs/common';

import { WeatherStationRepository } from '../../weather-station/domain/weather-station.repository';
import { MeasurementRepository } from '../domain/measurement.repository';
import { UserRepository } from '../../user/domain/user-repository';

import { NotificationService } from '../../notifications/application/notificationService';

import { UpdateMeasurementDto } from '../update-measurement.dto';

import { Measurement } from '../domain/measurement';
import { TemperatureRange } from '../domain/valueObjects/TemperatureRange';
import { Temperature, TemperatureUnit } from '../valueObjets/temperature';
import { Humidity } from '../valueObjets/humidity';
import { AtmosphericPressure } from '../valueObjets/atmosphericPressure';

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

    const measurement = Measurement.create({
      weatherStationId: input.weatherStationId,
      temperature: Temperature.create(
        input.temperature,
        TemperatureUnit.CELSIUS,
      ),
      humidity: Humidity.create(input.humidity),
      atmosphericPressure: AtmosphericPressure.create(input.atmosphericPressure),
    });

    await this.measurementRepo.create(measurement);

    if (measurement.isAnomaly) {
      const users = await this.userRepo.findBySubscribedStation(
        input.weatherStationId,
      );

      for (const user of users) {
        this.notificationService.notify(
          user.email.value,
          `Alert: ${measurement.alarmType} detected to User: ${user.name}`,
        );
      }
    }

    return measurement;
  }

  async update(measurementId: string, input: UpdateMeasurementDto) {
    const measurement = await this.measurementRepo.findById(measurementId);

    if (!measurement) {
      throw new NotFoundException('Measurement not found');
    }

    if (input.atmosphericPressure !== undefined) {
      measurement.atmosphericPressure = AtmosphericPressure.create(input.atmosphericPressure);
    }

    if (input.humidity !== undefined) {
      measurement.humidity = Humidity.create(input.humidity);
    }

    if (input.temperature !== undefined) {
      measurement.temperature = Temperature.create(
        input.temperature,
        measurement.temperature.unit,
      );
    }

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
      isActive: filters.onlyAnomalies,
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
