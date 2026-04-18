import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string = '';

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  surname: string = '';

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string = '';

   @IsArray()
  @ApiProperty({ type: [String] })
  subscriptionAlerts!: string[];
}
