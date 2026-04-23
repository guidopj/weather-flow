import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { WeatherStationService } from './application/weather-station.service';
import { CreateWeatherStationDto } from './create-weather-station.dto';
import { UpdateWeatherStationDto } from './update-weather-station.dto';

@Controller('weather-station')
export class WeatherStationController {
  constructor(private readonly weatherService: WeatherStationService) {}

  @Post()
  create(@Body() weatherStation: CreateWeatherStationDto) {
    return this.weatherService.create(weatherStation);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWeatherStationDto) {
    return this.weatherService.update(id, dto);
  }

  @Delete(':id')
    deleteMeasurement(@Param('id') id: string) {
      return this.weatherService.delete(id);
    }
}
