import { Controller, Get, Query } from '@nestjs/common';
import { MeasurementService } from './application/measurement.service';

@Controller('measurements')
export class MeasurementController {
   
  constructor(
    private readonly measurementService: MeasurementService,
  ) {}

  @Get('by-station')
  async filterByStationName(@Query('name') name: string) {
    return this.measurementService.findByStationName(name);
  }
}
