import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class LocationDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  latitude: number = 0;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  longitude: number = 0;
}
