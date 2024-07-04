import { ApiProperty } from '@nestjs/swagger';

export class HourlyWeatherResponseDto {
  @ApiProperty({ description: 'Temperature in Kelvin', example: 292.01 })
    temp: number;

  @ApiProperty({ description: 'Feels like temperature in Kelvin', example: 292.33 })
    feels_like: number;

  @ApiProperty({ description: 'Atmospheric pressure in hPa', example: 1014 })
    pressure: number;

  @ApiProperty({ description: 'Humidity percentage', example: 91 })
    humidity: number;

  @ApiProperty({ description: 'UV index', example: 0 })
    uvi: number;

  @ApiProperty({ description: 'Wind speed in meter/sec', example: 2.58 })
    wind_speed: number;

  @ApiProperty({ description: 'Time in Unix timestamp', example: 1684929540 })
    dt: number;
}
