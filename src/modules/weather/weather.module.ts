import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherRepository } from './weather.repository';
import { WeatherData } from '../../entities/weather-data.entity';

@Module({
  imports: [
    HttpModule.register({
      timeout: 2000,
      maxRedirects: 2,
      baseURL: 'https://api.openweathermap.org/data/3.0',
    }),
    TypeOrmModule.forFeature([WeatherData]),
  ],
  providers: [WeatherService, WeatherRepository],
  controllers: [WeatherController],
})
export class WeatherModule {}
