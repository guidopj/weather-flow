import { NotFoundException } from "@nestjs/common";

export class TemperatureRange {
  constructor(
    readonly min: number,
    readonly max: number
  ) {
    if (min > max) {
      throw new NotFoundException("Invalid range: min > max");
    }
  }

  contains(value: number): boolean {
    return value >= this.min && value <= this.max;
  }

  overlaps(other: TemperatureRange): boolean {
    return this.min <= other.max && this.max >= other.min;
  }
}