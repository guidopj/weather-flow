// infrastructure/measurement.repository.mongo.ts
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { WeatherStationRepository } from '../domain/weather-station.repository';
import { WeatherStation } from '../domain/weatherStation';
import { Location } from 'src/measurement/domain/valueObjects/Location';
import { PersistedWeatherStation } from '../domain/weather-station.types';

type WeatherStationDocument = HydratedDocument<{
  name: string;
  location: Location;
  sensorModel: string;
  state: boolean;
  ownerId: string;
}>;

@Injectable()
export class WeatherStationRepositoryMongo implements WeatherStationRepository {
  constructor(
    @InjectModel('WeatherStation')
    private readonly model: Model<WeatherStationDocument>,
  ) {}

  async create(
    weatherStation: WeatherStation,
  ): Promise<PersistedWeatherStation> {
    const doc = await this.model.create(this.toPersistence(weatherStation));

    const station = this.toDomain(doc);

    if (!station.id) {
      throw new Error('ID should exist after persistence');
    }

    return station as PersistedWeatherStation;
  }

  async update(
    weatherStationId: string,
    weatherStation: WeatherStation,
  ): Promise<WeatherStation | null> {
    const doc = await this.model.findByIdAndUpdate(
      weatherStationId,
      this.toPersistence(weatherStation),
      { new: true },
    );

    if (!doc) return null;

    return this.toDomain(doc);
  }

  async delete(id: string): Promise<WeatherStation | null> {
    const doc = await this.model.findByIdAndDelete(id);

    if (!doc) return null;

    return this.toDomain(doc);
  }

  async findByName(name: string) {
    const normalizedName = this.normalizeName(name);

    const doc = await this.model.findOne({
      name: normalizedName,
    });

    if (!doc) return null;

    return {
      id: doc._id.toString(),
      station: this.toDomain(doc),
    };
  }

  private normalizeName(name: string): string {
    return name.trim().toLowerCase().replace(/\s+/g, ' ');
  }

  private toPersistence(weatherStation: WeatherStation) {
    return {
      name: this.normalizeName(weatherStation.name),
      location: weatherStation.location,
      sensorModel: weatherStation.sensorModel,
      state: weatherStation.state,
      ownerId: weatherStation.ownerId,
    };
  }

  private toDomain(doc: WeatherStationDocument): WeatherStation {
    return new WeatherStation(
      doc.name,
      doc.location,
      doc.sensorModel,
      doc.state,
      doc.ownerId,
      doc._id.toString(),
    );
  }

  async findById(id: string): Promise<WeatherStation | null> {
    const userDoc = await this.model.findById(id);

    if (!userDoc) return null;

    return this.toDomain(userDoc);
  }
}
