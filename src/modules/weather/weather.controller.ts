import {
  Body,
  Controller, Get, NotFoundException, Post, Query, UseInterceptors, UsePipes, ValidationPipe,
} from '@nestjs/common';
import {
  ApiExtraModels, ApiOperation, ApiResponse, refs,
} from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { EWeatherPart } from './weather.types';
import { WeatherRequestDto } from './dto/weather-req.dto';
import { WeatherData } from '../../entities/weather-data.entity';
import { WeatherDataInterceptor } from './weather.interceptor';
import { CurrentWeatherResponseDto } from './dto/current-weather-res.dto';
import { MinutelyWeatherResponseDto } from './dto/minutely-weather-res.dto';
import { HourlyWeatherResponseDto } from './dto/hourly-weather-res.dto';
import { DailyWeatherResponseDto } from './dto/daily-weather-res.dto';
import { WeatherAlertResponseDto } from './dto/alerts-weather-res.dto';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @ApiOperation({ summary: 'Get weather data' })
  @ApiExtraModels(
    CurrentWeatherResponseDto,
    MinutelyWeatherResponseDto,
    HourlyWeatherResponseDto,
    DailyWeatherResponseDto,
    WeatherAlertResponseDto,
  )
  @ApiResponse({
    status: 200,
    description: 'Weather data retrieved successfully',
    schema: {
      anyOf: refs(
        CurrentWeatherResponseDto,
        MinutelyWeatherResponseDto,
        HourlyWeatherResponseDto,
        DailyWeatherResponseDto,
        WeatherAlertResponseDto,
      ),
    },
  })
  @ApiResponse({ status: 404, description: 'Weather data not found' })
  @UseInterceptors(WeatherDataInterceptor)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/')
  async getWeather(@Query() query: WeatherRequestDto): Promise<WeatherData> {
    const { lat, lon, part = EWeatherPart.CURRENT } = query;

    const weatherData = await this.weatherService.getWeather(lat, lon, part);

    if (!weatherData) {
      throw new NotFoundException('Weather data not found');
    }

    return weatherData;
  }

  @ApiOperation({ summary: 'Fetch and save weather data' })
  @ApiExtraModels(
    CurrentWeatherResponseDto,
    MinutelyWeatherResponseDto,
    HourlyWeatherResponseDto,
    DailyWeatherResponseDto,
    WeatherAlertResponseDto,
  )
  @ApiResponse({
    status: 201,
    description: 'Weather data fetched and saved successfully',
    schema: {
      anyOf: refs(
        CurrentWeatherResponseDto,
        MinutelyWeatherResponseDto,
        HourlyWeatherResponseDto,
        DailyWeatherResponseDto,
        WeatherAlertResponseDto,
      ),
    },
  })
  @UseInterceptors(WeatherDataInterceptor)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/')
  async fetchAndSaveWeatherData(
    @Body() weatherRequestDto: WeatherRequestDto,
  ): Promise<WeatherData> {
    const { lat, lon, part = EWeatherPart.CURRENT } = weatherRequestDto;

    return this.weatherService.fetchAndSaveWeatherData(lat, lon, part);
  }
}
