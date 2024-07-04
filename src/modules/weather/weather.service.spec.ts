import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherRepository } from './weather.repository';
import { WeatherData } from '../../entities/weather-data.entity';
import { EWeatherPart, OpenWeatherData } from './weather.types';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpService: HttpService;
  let configService: ConfigService;
  let weatherRepository: WeatherRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: WeatherRepository,
          useValue: {
            getLatest: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
    weatherRepository = module.get<WeatherRepository>(WeatherRepository);
  });

  describe('getWeatherData', () => {
    it('should return weather data', async () => {
      const weatherData: OpenWeatherData = {
        lat: 33.44,
        lon: -94.04,
        timezone: 'America/Chicago',
        timezone_offset: -18000,
        current: {
          dt: 1684929490,
          sunrise: 1684926645,
          sunset: 1684977332,
          temp: 292.55,
          feels_like: 292.87,
          pressure: 1014,
          humidity: 89,
          dew_point: 290.69,
          uvi: 0.16,
          clouds: 53,
          visibility: 10000,
          wind_speed: 3.13,
          wind_deg: 93,
          wind_gust: 6.71,
          weather: [
            {
              id: 803,
              main: 'Clouds',
              description: 'broken clouds',
              icon: '04d',
            },
          ],
        },
        minutely: [],
        hourly: [],
        daily: [],
        alerts: [],
      };

      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of({ data: weatherData }) as any);
      jest.spyOn(configService, 'get').mockReturnValue('test-api-key');

      const result = await service.getWeatherData({
        lat: 33.44,
        lon: -94.04,
        part: EWeatherPart.CURRENT,
      });
      expect(result).toEqual(weatherData);
    });

    it('should throw UnauthorizedException on 401 error', async () => {
      jest.spyOn(httpService, 'get').mockImplementationOnce(() => {
        throw new UnauthorizedException('Unauthorized for openweather api');
      });

      await expect(service.getWeatherData({
        lat: 33.44,
        lon: -94.04,
        part: EWeatherPart.CURRENT,
      })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw NotFoundException on other errors', async () => {
      jest.spyOn(httpService, 'get').mockImplementationOnce(() => {
        throw new NotFoundException('Weather data not found');
      });

      await expect(service.getWeatherData({
        lat: 33.44,
        lon: -94.04,
        part: EWeatherPart.CURRENT,
      })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('fetchAndSaveWeatherData', () => {
    it('should return existing weather data if it is recent', async () => {
      const lastWeatherData: WeatherData = {
        id: 1,
        lat: 33.44,
        lon: -94.04,
        part: EWeatherPart.CURRENT,
        weatherData: '{}',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(weatherRepository, 'getLatest').mockResolvedValue(lastWeatherData);

      const result = await service.fetchAndSaveWeatherData(33.44, -94.04, EWeatherPart.CURRENT);
      expect(result).toEqual(lastWeatherData);
    });

    it('should fetch and save new weather data if no recent data exists', async () => {
      const weatherData: OpenWeatherData = {
        lat: 33.44,
        lon: -94.04,
        timezone: 'America/Chicago',
        timezone_offset: -18000,
        current: {
          dt: 1684929490,
          sunrise: 1684926645,
          sunset: 1684977332,
          temp: 292.55,
          feels_like: 292.87,
          pressure: 1014,
          humidity: 89,
          dew_point: 290.69,
          uvi: 0.16,
          clouds: 53,
          visibility: 10000,
          wind_speed: 3.13,
          wind_deg: 93,
          wind_gust: 6.71,
          weather: [
            {
              id: 803,
              main: 'Clouds',
              description: 'broken clouds',
              icon: '04d',
            },
          ],
        },
        minutely: [],
        hourly: [],
        daily: [],
        alerts: [],
      };

      jest.spyOn(weatherRepository, 'getLatest').mockResolvedValue(null);
      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of({ data: weatherData }) as any);
      jest.spyOn(configService, 'get').mockReturnValue('test-api-key');
      jest.spyOn(weatherRepository, 'save').mockResolvedValue(new WeatherData());

      const result = await service.fetchAndSaveWeatherData(33.44, -94.04, EWeatherPart.CURRENT);
      expect(result).toBeInstanceOf(WeatherData);
    });
  });

  describe('getWeather', () => {
    it('should return latest weather data', async () => {
      const weatherData: WeatherData = {
        id: 1,
        lat: 33.44,
        lon: -94.04,
        part: EWeatherPart.CURRENT,
        weatherData: '{}',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(weatherRepository, 'getLatest').mockResolvedValue(weatherData);

      const result = await service.getWeather(33.44, -94.04, EWeatherPart.CURRENT);
      expect(result).toEqual(weatherData);
    });

    it('should return null if no weather data exists', async () => {
      jest.spyOn(weatherRepository, 'getLatest').mockResolvedValue(null);

      const result = await service.getWeather(33.44, -94.04, EWeatherPart.CURRENT);
      expect(result).toBeNull();
    });
  });
});
