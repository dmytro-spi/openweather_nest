import { ApiProperty } from '@nestjs/swagger';

export class DailyWeatherResponseDto {
  @ApiProperty({ description: 'Sunrise time in Unix timestamp', example: 1684926645 })
    sunrise: number;

  @ApiProperty({ description: 'Sunset time in Unix timestamp', example: 1684977332 })
    sunset: number;

  @ApiProperty({ description: 'Temperature in Kelvin', example: 299.03 })
    temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };

  @ApiProperty({ description: 'Feels like temperature in Kelvin', example: 299.21 })
    feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };

  @ApiProperty({ description: 'Atmospheric pressure in hPa', example: 1016 })
    pressure: number;

  @ApiProperty({ description: 'Humidity percentage', example: 59 })
    humidity: number;

  @ApiProperty({ description: 'UV index', example: 9.23 })
    uvi: number;

  @ApiProperty({ description: 'Wind speed in meter/sec', example: 3.98 })
    wind_speed: number;

  @ApiProperty({ description: 'Time in Unix timestamp', example: 1684929540 })
    dt: number;
}
