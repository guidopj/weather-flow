import { WeatherStation } from './weatherStation';

//PORT
export abstract class WeatherStationRepository {
  abstract create(weatherStation: WeatherStation): Promise<WeatherStation>;
  abstract update(
    weatherStationId: string,
    weatherStation: WeatherStation,
  ): Promise<WeatherStation | null>;
  abstract delete(id: string): Promise<WeatherStation | null>
  abstract findById(id: string): Promise<WeatherStation | null>;
  abstract findByName(
    name: string,
  ): Promise<{ id: string; station: WeatherStation } | null>;

  
}
