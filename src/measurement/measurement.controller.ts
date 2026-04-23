import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MeasurementService } from './application/measurement.service';
import { FilterQueryDto } from 'src/dto/filterQuery.dto';
import { CreateMeasurementDto } from './createMeasurement.dto';
import { UpdateMeasurementDto } from './update-measurement.dto';

@Controller('measurements')
export class MeasurementController {
  constructor(private readonly measurementService: MeasurementService) {}

  @Post()
  createMeasurement(@Body() measurement: CreateMeasurementDto) {
    return this.measurementService.create(measurement);
  }

  @Patch(':id')
  updateMeasurement(@Param('id') id: string, @Body() dto: UpdateMeasurementDto) {
    return this.measurementService.update(id, dto);
  }

  @Delete(':id')
  deleteMeasurement(@Param('id') id: string) {
    return this.measurementService.delete(id);
  }

  @Get('by-station')
  async filterByStationName(@Query('name') name: string) {
    return this.measurementService.findByStationName(name);
  }

  @Get('by-temperature-range')
  async filterByTemperatureRange(@Query() query: FilterQueryDto) {
    return this.measurementService.filterByTemperatureRange(
      query.min,
      query.max,
      query.isActive,
    );
  }
}
