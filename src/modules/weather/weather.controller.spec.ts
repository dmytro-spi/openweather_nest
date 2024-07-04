import { Test, TestingModule } from '@nestjs/testing';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NotFoundException } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherRequestDto } from './dto/weather-req.dto';
import { EWeatherPart } from './weather.types';
import { WeatherDataInterceptor } from './weather.interceptor';

describe('WeatherController', () => {
  let controller: WeatherController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: WeatherService;

  const mockWeatherService = {
    getWeather: jest.fn(),
    fetchAndSaveWeatherData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        { provide: WeatherService, useValue: mockWeatherService },
        {
          provide: APP_INTERCEPTOR,
          useClass: WeatherDataInterceptor,
        },
      ],
    }).compile();

    controller = module.get<WeatherController>(WeatherController);
    service = module.get<WeatherService>(WeatherService);
  });

  describe('getWeather', () => {
    it('should return weather data', async () => {
      const weatherData = {
        id: 1, lat: 33.44, lon: -94.04, part: EWeatherPart.CURRENT, weatherData: '{}',
      };
      mockWeatherService.getWeather.mockResolvedValue(weatherData);

      const query: WeatherRequestDto = { lat: 33.44, lon: -94.04, part: EWeatherPart.CURRENT };
      expect(await controller.getWeather(query)).toEqual(weatherData);
    });

    it('should throw NotFoundException if no weather data is found', async () => {
      mockWeatherService.getWeather.mockResolvedValue(null);

      const query: WeatherRequestDto = { lat: 33.44, lon: -94.04, part: EWeatherPart.CURRENT };
      await expect(controller.getWeather(query)).rejects.toThrow(NotFoundException);
    });
  });

  describe('fetchAndSaveWeatherData', () => {
    it('should fetch and save weather data', async () => {
      const weatherData = {
        id: 1, lat: 33.44, lon: -94.04, part: EWeatherPart.CURRENT, weatherData: '{}',
      };
      mockWeatherService.fetchAndSaveWeatherData.mockResolvedValue(weatherData);

      const dto: WeatherRequestDto = { lat: 33.44, lon: -94.04, part: EWeatherPart.CURRENT };
      expect(await controller.fetchAndSaveWeatherData(dto)).toEqual(weatherData);
    });
  });
});
