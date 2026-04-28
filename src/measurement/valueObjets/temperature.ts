export enum TemperatureUnit {
  CELSIUS = 'C',
  FAHRENHEIT = 'F',
  KELVIN = 'K',
}

export class Temperature {
  private readonly _value: number;
  private readonly _unit: TemperatureUnit;

  private constructor(value: number, unit: TemperatureUnit) {
    this.validate(value, unit);
    this._value = value;
    this._unit = unit;
  }

  static create(value: number, unit: TemperatureUnit): Temperature {
    return new Temperature(value, unit);
  }

  get value(): number {
    return this._value;
  }

  get unit(): TemperatureUnit {
    return this._unit;
  }

  private validate(value: number, unit: TemperatureUnit) {
    if (value === null || value === undefined || isNaN(value)) {
      throw new Error('Temperature value must be a valid number');
    }

    if (unit === TemperatureUnit.KELVIN && value < 0) {
      throw new Error('Kelvin temperature cannot be negative');
    }

    if (
      unit === TemperatureUnit.CELSIUS &&
      value < -273.15
    ) {
      throw new Error('Celsius cannot be below absolute zero');
    }

    if (
      unit === TemperatureUnit.FAHRENHEIT &&
      value < -459.67
    ) {
      throw new Error('Fahrenheit cannot be below absolute zero');
    }
  }

  equals(other: Temperature): boolean {
    return this._value === other._value && this._unit === other._unit;
  }

  toString(): string {
    return `${this._value}°${this._unit}`;
  }
}