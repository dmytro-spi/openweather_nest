import {
  IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { EWeatherPart } from '../weather.types';

export class WeatherRequestDto {
  @ApiProperty({
    description: 'Latitude of the location',
    example: 37.7749,
  })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
    lat: number;

  @ApiProperty({
    description: 'Longitude of the location',
    example: -122.4194,
  })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
    lon: number;

  @ApiPropertyOptional({
    description: 'Parts to exclude from the response',
    enum: EWeatherPart,
    example: 'current',
    default: EWeatherPart.CURRENT,
  })
  @IsString()
  @IsOptional()
  @IsEnum(EWeatherPart)
    part?: EWeatherPart;
}
