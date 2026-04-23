import { Module } from '@nestjs/common';
import { WeatherStationController } from './weather-station.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherStationSchema } from './infrastructure/weather-station.schema';
import { WeatherStationService } from './application/weather-station.service';
import { WeatherStationRepository } from './domain/weather-station.repository';
import { WeatherStationRepositoryMongo } from './infrastructure/weather-station.repository.mongo';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
        MongooseModule.forFeature([
          { name: "WeatherStation", schema: WeatherStationSchema },
        ]),
        UserModule
      ],
  controllers: [WeatherStationController],
  exports: [WeatherStationRepository],
  providers: [
        WeatherStationService,
        {
          provide: WeatherStationRepository,
          useClass: WeatherStationRepositoryMongo,
        },
      ],
})
export class WeatherStationModule {}
