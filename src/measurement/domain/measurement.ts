import { AlarmType } from 'src/types/measurement.types';

export class Measurement {
  constructor(
    public weatherStationId: string,
    public timestamp: Date,
    public temperature: number,
    public humidity: number,
    public atmosphericPressure: number,
    public alarmType: AlarmType | null,
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

  private static calculateAlarmType(input: {
    temperature: number;
    humidity: number;
    atmosphericPressure: number;
  }): AlarmType | null {
    if (input.temperature > 40) return 'EXTREME_HEAT';
    if (input.temperature < 0) return 'FROST';
    if (input.atmosphericPressure < 980) return 'LOW_PRESSURE';
    if (input.humidity > 90) return 'HIGH_HUMIDITY';
    return null;
  }
}
