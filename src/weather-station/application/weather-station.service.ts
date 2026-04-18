import { Injectable } from '@nestjs/common';

import { WeatherStationRepository } from '../domain/weather-station.repository';
import { CreateWeatherStationDto } from '../create-weather-station.dto';
import { UpdateWeatherStationDto } from '../update-weather-station.dto';
import { WeatherStation } from '../domain/weatherStation';
import { Location } from 'src/measurement/domain/valueObjects/Location';

@Injectable()
export class WeatherStationService {
  constructor(private readonly repo: WeatherStationRepository) {}

  async createWeatherStation(weatherStation: CreateWeatherStationDto) {
    // 1. crear entidad de dominio

    const location = Location.create(
      weatherStation.location.latitude,
      weatherStation.location.longitude,
    );
    const newUser = new WeatherStation(
      weatherStation.name,
      location,
      weatherStation.sensorModel,
      weatherStation.state,
      weatherStation.ownerId,
    );

    // 2. persistir usando puerto
    await this.repo.save(newUser);

    return newUser;
  }

  async updateWeatherStation(
    id: string,
    newWeatherStation: UpdateWeatherStationDto,
  ) {
    const storedWeatherStation: WeatherStation | null =
      await this.repo.findById(id);
    if (!storedWeatherStation) throw new Error('Weather Station not found');

    // aplicar cambios (sin romper dominio)
    if (newWeatherStation.name)
      storedWeatherStation.name = newWeatherStation.name;
    if (newWeatherStation.location) {
      storedWeatherStation.location = Location.create(
        newWeatherStation.location.latitude,
        newWeatherStation.location.longitude,
      );
    }
    if(newWeatherStation.sensorModel) storedWeatherStation.sensorModel = newWeatherStation.sensorModel;
    if(newWeatherStation.state) storedWeatherStation.state = newWeatherStation.state;

    await this.repo.update(storedWeatherStation);

    return storedWeatherStation;
  }
}
