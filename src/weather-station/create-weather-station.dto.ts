import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { LocationDto } from 'src/dto/location.dto';

export class CreateWeatherStationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name!: string ;

  @IsNotEmpty()
  @ApiProperty()
  location!: LocationDto;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  sensorModel!: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsBoolean()
  state!: boolean;

  @IsMongoId()
  @ApiProperty()
  ownerId!: string;
}
