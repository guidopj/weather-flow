// infrastructure/measurement.repository.mongo.ts
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { MeasurementRepository } from '../domain/measurement.repository';
import { Measurement } from '../domain/measurement';
import { TemperatureRange } from '../domain/valueObjects/TemperatureRange';
import { AlertType } from '../domain/AlertTypes';

type MeasurementType = {
  weatherStationId: string;
  timestamp: Date;
  temperature: number;
  humidity: number;
  atmosphericPressure: number;
  alarmType: AlertType | null;
};

type MeasurementDocument = HydratedDocument<MeasurementType>;

type Query = Record<string, any>;

@Injectable()
export class MeasurementRepositoryMongo implements MeasurementRepository {
  constructor(
    @InjectModel('Measurement')
    private readonly model: Model<MeasurementType>,
  ) {}

  async create(measurement: Measurement): Promise<void> {
    await this.model.create(this.toPersistence(measurement));
  }

  async update(id: string, measurement: Measurement): Promise<void> {
    await this.model.updateOne({ _id: id }, this.toPersistence(measurement));
  }

  async delete(id: string): Promise<Measurement | null> {
    return this.model.findByIdAndDelete(id);
  }

  private toPersistence(measurement: Measurement) {
    return {
      weatherStationId: measurement.weatherStationId,
      timestamp: measurement.timestamp,
      temperature: measurement.temperature,
      humidity: measurement.humidity,
      atmosphericPressure: measurement.atmosphericPressure,
      alarmType: measurement.alarmType ?? AlertType.NONE,
    };
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

  async findById(id: string): Promise<Measurement | null> {
    const measurementDoc = await this.model.findById(id);

    if (!measurementDoc) return null;

    return this.toDomain(measurementDoc);
  }

  applyTemperatureRange = (range?: TemperatureRange) => (query: Query) =>
    range
      ? {
          ...query,
          temperature: {
            $gte: range.min,
            $lte: range.max,
          },
        }
      : query;

  applyActiveAlerts = (onlyAnomalies?: boolean) => (query: Query) => {
    if (onlyAnomalies === undefined) return query;

    return {
      ...query,
      alarmType: onlyAnomalies ? { $ne: AlertType.NONE } : AlertType.NONE,
    };
  };

  applyWeatherStation = (weatherStationId?: string) => (query: Query) =>
    weatherStationId
      ? {
          ...query,
          weatherStationId,
        }
      : query;

  async getAllByCriteria(criteria: {
    weatherStationId?: string;
    temperatureRange?: TemperatureRange;
    onlyAnomalies?: boolean;
  }): Promise<Measurement[]> {
    let query: Query = {};

    query = this.applyWeatherStation(criteria.weatherStationId)(query);
    query = this.applyTemperatureRange(criteria.temperatureRange)(query);
    query = this.applyActiveAlerts(criteria.onlyAnomalies)(query);

    const docs = await this.model.find(query);

    return docs.map((doc) => this.toDomain(doc));
  }
}
