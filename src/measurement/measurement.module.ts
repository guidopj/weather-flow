import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose"

import { MeasurementRepositoryMongo } from './infrastructure/measurement.repository.mongo';
import { MeasurementSchema } from './infrastructure/measurement.schema';

import { CreateMeasurementService } from './application/register-measurement.service';

import { MeasurementRepository } from './domain/measurement.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Measurement", schema: MeasurementSchema },
    ]),
  ],
  providers: [
    CreateMeasurementService,
    {
      provide: MeasurementRepository,
      useClass: MeasurementRepositoryMongo,
    },
  ],
})

export class MeasurementModule {}
