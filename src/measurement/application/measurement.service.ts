import { Injectable } from '@nestjs/common';
import { MeasurementRepository } from '../domain/measurement.repository';
import { Measurement } from '../domain/measurement';
import { TemperatureRange } from '../domain/valueObjects/TemperatureRange';
import { WeatherStationRepository } from '../../weather-station/domain/weather-station.repository';
import { UpdateMeasurementDto } from '../update-measurement.dto';

@Injectable()
export class MeasurementService {
  constructor(
    private readonly measurementRepo: MeasurementRepository,
    private readonly weatherStationRepo: WeatherStationRepository,
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
      throw new Error('Weather station not found');
    }

    const measurement = Measurement.create(input);

    await this.measurementRepo.create(measurement);

    return measurement;
  }

  async update(measurementId: string, input: UpdateMeasurementDto) {
    const measurement: Measurement | null =
      await this.measurementRepo.findById(measurementId);
    if (!measurement) throw new Error('Measurement not found');

    if (input.atmosphericPressure)
      measurement.atmosphericPressure = input.atmosphericPressure;
    if (input.humidity) measurement.humidity = input.humidity;
    if (input.temperature) measurement.temperature = input.temperature;

    await this.measurementRepo.update(measurementId, measurement);

    return measurement;
  }

  async delete(id: string) {
    await this.measurementRepo.delete(id)
  }

  async findByStationName(weatherStationName: string): Promise<Measurement[]> {
    const weatheStation =
      await this.weatherStationRepo.findByName(weatherStationName);

    if (!weatheStation) return [];

    return this.measurementRepo.findByStationId(weatheStation.id);
  }

  async filterByTemperatureRange(
    min?: number,
    max?: number,
    isActive?: boolean,
  ): Promise<Measurement[]> {
    const range =
      min !== undefined && max !== undefined
        ? new TemperatureRange(min, max)
        : undefined;

    return this.measurementRepo.getAllByCriteria({
      temperatureRange: range,
      isActive: isActive,
    });
  }
}
