import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WeatherData } from '../../entities/weather-data.entity';
import { EWeatherPart } from './weather.types';

@Injectable()
export class WeatherRepository {
  constructor(
    @InjectRepository(WeatherData)
    private readonly repository: Repository<WeatherData>,
  ) {}

  getLatest(lat: number, lon: number, part: EWeatherPart) {
    return this.repository.findOne({
      where: { lat, lon, part },
      order: { updatedAt: 'DESC' },
    });
  }

  save(weatherData: WeatherData) {
    return this.repository.save(weatherData);
  }
}
