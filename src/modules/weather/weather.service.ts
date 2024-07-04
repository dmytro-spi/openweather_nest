import {
  Injectable, NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';
import { catchError, firstValueFrom } from 'rxjs';
import { EWeatherPart, OpenWeatherData } from './weather.types';
import { WeatherRequestDto } from './dto/weather-req.dto';
import { WeatherRepository } from './weather.repository';
import { WeatherData } from '../../entities/weather-data.entity';

@Injectable()
export class WeatherService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly weatherRepository: WeatherRepository,
  ) {}

  async getWeatherData(query: WeatherRequestDto) {
    const { lat, lon, part } = query;

    const response = await firstValueFrom(this.httpService.get<OpenWeatherData>('/onecall', {
      params: {
        lat,
        lon,
        exclude: Object.values(EWeatherPart).filter((p) => p !== part).join(','), // exclude all parts except the requested one
        appid: this.configService.get<string>('OPENWEATHER_API_KEY'),
      },
    }).pipe(
      catchError((error) => {
        if (error.response?.status === 401) {
          throw new UnauthorizedException('Unauthorized for openweather api');
        }

        throw new NotFoundException('Weather data not found');
      }),
    ));

    return response.data;
  }

  async fetchAndSaveWeatherData(
    lat: number,
    lon: number,
    part: EWeatherPart,
  ): Promise<WeatherData> {
    const lastWeatherData = await this.weatherRepository.getLatest(lat, lon, part);

    // return existing data if exists for current part
    if (lastWeatherData) {
      const now = DateTime.now();

      const updatedAt = DateTime.fromJSDate(lastWeatherData.updatedAt);

      if (
        (part === EWeatherPart.MINUTELY && updatedAt.diff(now, 'minutes').minutes > -1)
          || (part !== EWeatherPart.MINUTELY && updatedAt.diff(now, 'hours').hours > -1)
      ) {
        return lastWeatherData;
      }
    }

    const data = await this.getWeatherData({ lat, lon, part });

    const weatherData = new WeatherData();
    Object.assign(weatherData, {
      lat, lon, part, weatherData: JSON.stringify(data),
    });

    return this.weatherRepository.save(weatherData);
  }

  async getWeather(lat: number, lon: number, part: EWeatherPart): Promise<WeatherData> {
    return this.weatherRepository.getLatest(lat, lon, part);
  }
}
