import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { pick } from 'lodash';
import { WeatherData } from '../../entities/weather-data.entity';
import {
  DailyWeather,
  EWeatherPart,
  HourlyWeather,
  MinutelyWeather,
  OpenWeatherData,
  WeatherAlert,
  CurrentWeather,
} from './weather.types';

@Injectable()
export class WeatherDataInterceptor implements NestInterceptor {
  private readonly logger = new Logger(WeatherDataInterceptor.name);

  getPartData<T>(data: OpenWeatherData, part: EWeatherPart): T | null {
    try {
      return (data?.[part] as T) || null;
    } catch (error) {
      this.logger.error('Failed to get part data', error);
    }

    return null;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: WeatherData) => {
        let dataToConvert: OpenWeatherData | null = null;

        try {
          dataToConvert = JSON.parse(data.weatherData) as OpenWeatherData;
        } catch (error) {
          throw new InternalServerErrorException('Failed to parse weather data');
        }

        const { part } = data;

        switch (part) {
          case EWeatherPart.ALERTS: {
            return this.getPartData<WeatherAlert[]>(dataToConvert, part as EWeatherPart);
          }

          case EWeatherPart.MINUTELY: {
            return this.getPartData<MinutelyWeather[]>(dataToConvert, part as EWeatherPart);
          }

          case EWeatherPart.HOURLY: {
            const hourlyData = this.getPartData<HourlyWeather[]>(
              dataToConvert,
              part as EWeatherPart,
            );

            if (!hourlyData || !Array.isArray(hourlyData)) {
              return null;
            }

            return hourlyData.map((hourly: HourlyWeather) => pick(
              hourly,
              [
                'temp',
                'feels_like',
                'pressure',
                'humidity',
                'uvi',
                'wind_speed',
                'dt',
              ],
            ));
          }

          case EWeatherPart.DAILY: {
            const dailyData = this.getPartData<DailyWeather[]>(dataToConvert, part as EWeatherPart);

            if (!dailyData || !Array.isArray(dailyData)) {
              return null;
            }

            return dailyData.map((daily: DailyWeather) => pick(
              daily,
              [
                'sunrise',
                'sunset',
                'temp',
                'feels_like',
                'pressure',
                'humidity',
                'uvi',
                'wind_speed',
                'dt',
              ],
            ));
          }

          case EWeatherPart.CURRENT: {
            const currentData = this.getPartData<CurrentWeather>(
              dataToConvert,
              part as EWeatherPart,
            );

            if (!currentData) {
              return null;
            }

            return pick(currentData, ['sunrise', 'sunset', 'temp', 'feels_like', 'pressure', 'humidity', 'uvi', 'wind_speed']);
          }

          default: {
            return null;
          }
        }
      }),
    );
  }
}
