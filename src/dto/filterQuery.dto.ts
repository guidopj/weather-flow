import { IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional()
  min?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional()
  max?: number;

  @IsOptional()
  @Transform(({ value }) => {
  if (value === undefined) return undefined;

  if (typeof value === 'boolean') return value;

  const normalized = String(value).toLowerCase().trim();

  if (['true', '1'].includes(normalized)) return true;
  if (['false', '0'].includes(normalized)) return false;

  return undefined;
})
  @IsBoolean()
  @ApiPropertyOptional()
  isActive?: boolean;
}
