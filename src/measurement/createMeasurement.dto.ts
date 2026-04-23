import { IsDateString, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateMeasurementDto {
  @IsString()
  weatherStationId!: string;

  @IsNumber()
  @Min(-90)
  @Max(60)
  temperature!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  humidity!: number;

  @IsNumber()
  @Min(300)
  @Max(1100)
  atmosphericPressure!: number;
}
