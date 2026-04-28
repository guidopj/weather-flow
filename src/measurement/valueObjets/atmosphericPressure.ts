export class AtmosphericPressure {
  private readonly _value: number;

  private constructor(value: number) {
    this.validate(value);
    this._value = value;
  }

  static create(value: number): AtmosphericPressure {
    return new AtmosphericPressure(value);
  }

  get value(): number {
    return this._value;
  }

  equals(other: AtmosphericPressure): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return `${this._value} hPa`;
  }

  private validate(value: number) {
    if (value === null || value === undefined || isNaN(value)) {
      throw new Error('Atmospheric pressure must be a valid number');
    }

    if (value <= 0) {
      throw new Error('Atmospheric pressure must be greater than 0');
    }

    if (value < 300 || value > 1100) {
      throw new Error('Atmospheric pressure out of realistic range');
    }
  }
}