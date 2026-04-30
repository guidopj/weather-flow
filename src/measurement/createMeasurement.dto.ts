import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateMeasurementDto {
  @ApiProperty()
  @IsString()
  weatherStationId!: string;

  @ApiProperty({ minimum: -90, maximum: 60 })
  @IsNumber()
  @Min(-90)
  @Max(60)
  temperature!: number;

  @ApiProperty({ minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  humidity!: number;

  @ApiProperty({ minimum: 300, maximum: 1100 })
  @IsNumber()
  @Min(300)
  @Max(1100)
  atmosphericPressure!: number;
}