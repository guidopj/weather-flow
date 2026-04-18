// infrastructure/measurement.repository.mongo.ts
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Injectable } from "@nestjs/common"

import { MeasurementRepository } from "../domain/measurement.repository"
import { Measurement } from "../domain/measurement"

@Injectable()
export class MeasurementRepositoryMongo implements MeasurementRepository {
  constructor(
    @InjectModel("Measurement")
    private readonly model: Model<any>
  ) {}

  async save(measurement: Measurement): Promise<void> {
    await this.model.create({
      weatherStationId: measurement.weatherStationId,
      timestamp: measurement.timestamp,
      temperature: measurement.temperature,
      humidity: measurement.humidity,
      atmosphericPressure: measurement.atmosphericPressure
    })
  }
}