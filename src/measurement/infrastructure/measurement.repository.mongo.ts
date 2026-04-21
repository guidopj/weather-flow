// infrastructure/measurement.repository.mongo.ts
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { MeasurementRepository } from '../domain/measurement.repository';
import { Measurement } from '../domain/measurement';
import { WeatherStationRepository } from 'src/weather-station/domain/weather-station.repository';
import { AlarmType } from 'src/types/measurement.types';

type MeasurementDocument = HydratedDocument<{
  weatherStationId: string;
  timestamp: Date;
  temperature: number;
  humidity: number;
  atmosphericPressure: number;
  alarmType: AlarmType;
}>;

@Injectable()
export class MeasurementRepositoryMongo implements MeasurementRepository {
  constructor(
    @InjectModel('Measurement')
    private readonly model: Model<MeasurementDocument>,
    private readonly weatherStationRepo: WeatherStationRepository,
  ) {}
  

  private toPersistence(measurement: Measurement) {
    return {
      weatherStationId: measurement.weatherStationId,
      timestamp: measurement.timestamp,
      temperature: measurement.temperature,
      humidity: measurement.humidity,
      atmosphericPressure: measurement.atmosphericPressure,
      alarmType: measurement.alarmType,
    };
  }

  async save(measurement: Measurement): Promise<void> {
    await this.model.create(this.toPersistence(measurement));
  }

  private toDomain(doc: MeasurementDocument): Measurement {
    return new Measurement(
      doc.weatherStationId,
      doc.timestamp,
      doc.temperature,
      doc.humidity,
      doc.atmosphericPressure,
      doc.alarmType,
    );
  }

  

  async findByStationId(id: string): Promise<Measurement[]> {
  const docs = await this.model.find({
    weatherStationId: id,
  });

  return docs.map((doc) => this.toDomain(doc));
}
}
