import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose"

import { MeasurementRepositoryMongo } from './infrastructure/measurement.repository.mongo';
import { MeasurementSchema } from './infrastructure/measurement.schema';

import { MeasurementRepository } from './domain/measurement.repository';
import { MeasurementService } from './application/measurement.service';
import { MeasurementController } from './measurement.controller';
import { WeatherStationModule } from 'src/weather-station/weather-station.module';
import { UserModule } from 'src/user/user.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Measurement", schema: MeasurementSchema },
    ]),
    WeatherStationModule,
    UserModule,
    NotificationsModule
  ],
  controllers: [MeasurementController],
  providers: [
    MeasurementService,
    
    {
      provide: MeasurementRepository,
      useClass: MeasurementRepositoryMongo,
    },
  ],
})

export class MeasurementModule {}
