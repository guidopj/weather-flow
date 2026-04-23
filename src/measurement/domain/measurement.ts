
import { AlertType } from "./AlertTypes";
import { NotFoundException } from "@nestjs/common";

export class Measurement {
  constructor(
    public weatherStationId: string,
    public timestamp: Date,
    public temperature: number,
    public humidity: number,
    public atmosphericPressure: number,
    public alarmType: AlertType | null,
  ) {
    this.validate();
  }

  static create(props: {
    weatherStationId: string;
    temperature: number;
    humidity: number;
    atmosphericPressure: number;
  }): Measurement {
    const alarmType = this.calculateAlarmType(props);

    return new Measurement(
      props.weatherStationId,
      new Date(),
      props.temperature,
      props.humidity,
      props.atmosphericPressure,
      alarmType,
    );
  }

  get isAnomaly(): boolean {
    return this.alarmType !== null && this.alarmType !== AlertType.NONE;
  }

  private validate() {
    if (this.temperature < -90 || this.temperature > 60) {
      throw new NotFoundException('Temperature out of range');
    }

    if (this.humidity < 0 || this.humidity > 100) {
      throw new NotFoundException('Humidity out of range');
    }

    if (this.atmosphericPressure < 300 || this.atmosphericPressure > 1100) {
      throw new NotFoundException('Pressure out of range');
    }
  }

  private static calculateAlarmType(input: {
    temperature: number;
    humidity: number;
    atmosphericPressure: number;
  }): AlertType | null {
    if (input.temperature > 40) return AlertType.HEAT_WAVE;
    if (input.temperature < 0) return AlertType.FROST;
    if (input.atmosphericPressure < 980) return AlertType.LOW_PRESSURE;
    if (input.humidity > 90) return AlertType.HIGH_HUMIDITY;
    return AlertType.NONE;
  }
}