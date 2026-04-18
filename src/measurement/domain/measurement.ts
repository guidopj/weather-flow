import { AlarmType } from "src/types/measurement.types";

export class Measurement {
  constructor(
    public readonly weatherStationId: string,
    public readonly timestamp: Date,
    public readonly temperature: number,
    public readonly humidity: number,
    public readonly atmosphericPressure: number,
    public readonly alarmType: AlarmType
  ) {
    this.validate();
  }

  private validate() {
    if (this.temperature < -90 || this.temperature > 60) {
      throw new Error('Temperature out of range');
    }

    if (this.humidity < 0 || this.humidity > 100) {
      throw new Error('Humidity out of range');
    }

    if (this.atmosphericPressure < 300 || this.atmosphericPressure > 1100) {
      throw new Error('Pressure out of range');
    }
  }
}