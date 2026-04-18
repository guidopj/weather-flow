// infrastructure/measurement.repository.mongo.ts
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { WeatherStationRepository } from '../domain/weather-station.repository';
import { WeatherStation } from '../domain/weatherStation';
import { Location } from 'src/measurement/domain/valueObjects/Location';

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

  private toPersistence(weatherStation: WeatherStation) {
    return {
      name: weatherStation.name,
      location: weatherStation.location,
      sensorModel: weatherStation.sensorModel,
      state: weatherStation.state,
      ownerId: weatherStation.ownerId,
    };
  }

  async save(weatherStation: WeatherStation): Promise<WeatherStation> {
    const doc = await this.model.create(this.toPersistence(weatherStation));
    return this.toDomain(doc);
  }

  /* doc → infraestructura (Mongo)
    User → dominio */
  private toDomain(doc: WeatherStationDocument): WeatherStation {
    return new WeatherStation(
      doc._id.toString(),
      doc.name,
      doc.location,
      doc.sensorModel,
      doc.state,
      doc.ownerId,
    );
  }

  async findById(id: string): Promise<WeatherStation | null> {
    const userDoc = await this.model.findById(id);

    if (!userDoc) return null;

    return this.toDomain(userDoc);
  }

  async update(weatherStation: WeatherStation): Promise<WeatherStation | null> {
  const doc = await this.model.findByIdAndUpdate(
    weatherStation.id,
    this.toPersistence(weatherStation),
    { new: true }
  );

  if (!doc) return null;

  return this.toDomain(doc);
}

  async delete(id: string): Promise<WeatherStation | null> {
    return this.model.findByIdAndDelete(id);
  }
}
