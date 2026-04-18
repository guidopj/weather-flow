import { WeatherStation } from "./weatherStation";

//PORT
export abstract class WeatherStationRepository {
  abstract save(weatherStation: WeatherStation): Promise<WeatherStation>
  abstract update(weatherStation: WeatherStation): Promise<WeatherStation | null>
  abstract findById(id: string): Promise<WeatherStation | null>
}