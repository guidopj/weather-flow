import { Measurement } from "./measurement";

//PORT
export abstract class MeasurementRepository {
  abstract save(measurement: Measurement): Promise<void>
}