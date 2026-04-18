import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { WeatherStationService } from './application/weather-station.service';
import { CreateWeatherStationDto } from './create-weather-station.dto';
import { UpdateWeatherStationDto } from './update-weather-station.dto';

@Controller('weather-station')
export class WeatherStationController {
    constructor(private readonly weatherService: WeatherStationService) {}
    
    @Post()
      createWeatherStation(@Body() weatherStation: CreateWeatherStationDto) {
        return this.weatherService.createWeatherStation(weatherStation);
      }
    
      @Patch(':id')
      updateUser(@Param('id') id: string, @Body() dto: UpdateWeatherStationDto) {
        return this.weatherService.updateWeatherStation(id, dto);
      }
}
