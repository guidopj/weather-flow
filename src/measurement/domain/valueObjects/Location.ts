export class Location {
  public readonly latitude: number;
  public readonly longitude: number;

  private constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  static create(latitude: number, longitude: number): Location {
    this.validate(latitude, longitude);
    return new Location(latitude, longitude);
  }

  private static validate(latitude: number, longitude: number): void {
    if (latitude < -90 || latitude > 90) {
      throw new Error("Latitude must be between -90 and 90");
    }

    if (longitude < -180 || longitude > 180) {
      throw new Error("Longitude must be between -180 and 180");
    }
  }

  equals(other: Location): boolean {
    return (
      this.latitude === other.latitude &&
      this.longitude === other.longitude
    );
  }
}