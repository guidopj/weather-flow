import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateMeasurementDto {

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(60)
  temperature?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  humidity?: number;

  @IsOptional()
  @IsNumber()
  @Min(300)
  @Max(1100)
  atmosphericPressure?: number;
}