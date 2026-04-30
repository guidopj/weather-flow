export class Humidity {
  private readonly _value: number;

  private constructor(value: number) {
    this.validate(value);
    this._value = value;
  }

  static create(value: number): Humidity {
    return new Humidity(value);
  }

  get value(): number {
    return this._value;
  }

  equals(other: Humidity): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return `${this._value}%`;
  }

  private validate(value: number) {
    if (value === null || value === undefined || isNaN(value)) {
      throw new Error('Humidity must be a valid number');
    }

    if (value < 0 || value > 100) {
      throw new Error('Humidity must be between 0 and 100');
    }
  }
}