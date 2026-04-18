
import { AlarmType } from "src/types/measurement.types";
import { MeasurementRepository } from "../domain/measurement.repository";
import { Measurement } from "../domain/measurement";

export class CreateMeasurementService {
  constructor(private readonly repo: MeasurementRepository) {}

  async execute(input: {
    
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
      input.alarmType
    );

    // 2. persistir usando puerto
    await this.repo.save(measurement);

    return measurement;
  }
}