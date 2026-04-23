import { Measurement } from './measurement';
import { TemperatureRange } from './valueObjects/TemperatureRange';

//PORT
export abstract class MeasurementRepository {
  abstract create(measurement: Measurement): Promise<void>;

  abstract update(id: string, measurement: Measurement): Promise<void>

  abstract findByStationId(id: string): Promise<Measurement[]>;

  abstract findById(id: string): Promise<Measurement | null>

  abstract delete(id: string): Promise<Measurement | null>

  abstract getAllByCriteria(criteria: {
    temperatureRange?: TemperatureRange;
    isActive?: boolean;
  });
}
