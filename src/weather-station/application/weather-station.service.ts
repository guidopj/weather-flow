import { Injectable, NotFoundException } from '@nestjs/common';

import { WeatherStationRepository } from '../domain/weather-station.repository';
import { UserRepository } from '../../user/domain/user-repository';

import { CreateWeatherStationDto } from '../create-weather-station.dto';
import { UpdateWeatherStationDto } from '../update-weather-station.dto';
import { WeatherStation } from '../domain/weatherStation';
import { Location } from '../../measurement/domain/valueObjects/Location';

@Injectable()
export class WeatherStationService {
  constructor(
    private readonly weatherStationRepo: WeatherStationRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async create(weatherStation: CreateWeatherStationDto) {
    const owner = await this.userRepo.findById(weatherStation.ownerId);

    if (!owner) {
      throw new NotFoundException('Owner not found');
    }
    
    const location = Location.create(
      weatherStation.location.latitude,
      weatherStation.location.longitude,
    );
    const newWeatherStation = new WeatherStation(
      weatherStation.name,
      location,
      weatherStation.sensorModel,
      weatherStation.state,
      weatherStation.ownerId,
    );

    const createdStation =
      await this.weatherStationRepo.create(newWeatherStation);

    owner.subscribe(createdStation.id);

    await this.userRepo.update(owner.id, owner);

    return createdStation;
  }

  async update(
    weatherStationId: string,
    newWeatherStation: UpdateWeatherStationDto,
  ) {
    const storedWeatherStation: WeatherStation | null =
      await this.weatherStationRepo.findById(weatherStationId);
    if (!storedWeatherStation)
      throw new NotFoundException('weather station not found');

    // aplicar cambios (sin romper dominio)
    if (newWeatherStation.name)
      storedWeatherStation.name = newWeatherStation.name;
    if (newWeatherStation.location) {
      storedWeatherStation.location = Location.create(
        newWeatherStation.location.latitude,
        newWeatherStation.location.longitude,
      );
    }
    if (newWeatherStation.sensorModel)
      storedWeatherStation.sensorModel = newWeatherStation.sensorModel;
    if (newWeatherStation.state)
      storedWeatherStation.state = newWeatherStation.state;

    await this.weatherStationRepo.update(
      weatherStationId,
      storedWeatherStation,
    );

    return storedWeatherStation;
  }

  async delete(stationId: string): Promise<WeatherStation | null> {
    const users = await this.userRepo.findBySubscribedStation(stationId)

    for(const user of users){
      user.unsubscribe(stationId)
      await this.userRepo.update(user.id!, user);

    }
    return await this.weatherStationRepo.delete(stationId);
  }
}
