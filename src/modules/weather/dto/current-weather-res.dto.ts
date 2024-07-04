import { ApiProperty } from '@nestjs/swagger';

export class CurrentWeatherResponseDto {
  @ApiProperty({ description: 'Sunrise time in Unix timestamp', example: 1684926645 })
    sunrise: number;

  @ApiProperty({ description: 'Sunset time in Unix timestamp', example: 1684977332 })
    sunset: number;

  @ApiProperty({ description: 'Temperature in Kelvin', example: 292.55 })
    temp: number;

  @ApiProperty({ description: 'Feels like temperature in Kelvin', example: 292.87 })
    feels_like: number;

  @ApiProperty({ description: 'Atmospheric pressure in hPa', example: 1014 })
    pressure: number;

  @ApiProperty({ description: 'Humidity percentage', example: 89 })
    humidity: number;

  @ApiProperty({ description: 'UV index', example: 0.16 })
    uvi: number;

  @ApiProperty({ description: 'Wind speed in meter/sec', example: 3.13 })
    wind_speed: number;
}
