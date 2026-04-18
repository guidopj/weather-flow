import { IsArray, IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LocationDto } from 'src/dto/location.dto';

export class UpdateWeatherStationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  location?: LocationDto = {longitude: 0, latitude: 0};

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sensorModel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  state?: boolean
}