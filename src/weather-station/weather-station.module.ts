import { Module } from '@nestjs/common';
import { WeatherStationController } from './weather-station.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherStationSchema } from './infrastructure/weather-station.schema';
import { WeatherStationService } from './application/weather-station.service';
import { WeatherStationRepository } from './domain/weather-station.repository';
import { WeatherStationRepositoryMongo } from './infrastructure/weather-station.repository.mongo';

@Module({
  imports: [
        MongooseModule.forFeature([
          { name: "Measurement", schema: WeatherStationSchema },
        ]),
      ],
  controllers: [WeatherStationController],
  providers: [
        WeatherStationService,
        {
          provide: WeatherStationRepository,
          useClass: WeatherStationRepositoryMongo,
        },
      ],
})
export class WeatherStationModule {}
