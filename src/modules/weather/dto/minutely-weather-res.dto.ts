import { ApiProperty } from '@nestjs/swagger';

export class MinutelyWeatherResponseDto {
  @ApiProperty({ description: 'Time in Unix timestamp', example: 1684929540 })
    dt: number;

  @ApiProperty({ description: 'Precipitation volume', example: 0 })
    precipitation: number;
}
