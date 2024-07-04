import {
  Column, Entity, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import { EWeatherPart } from '../modules/weather/weather.types';

@Entity()
@Index(['lat', 'lon', 'part'])
export class WeatherData {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({ type: 'float' })
    lat: number;

  @Column({ type: 'float' })
    lon: number;

  @Column({ type: 'text', nullable: true })
  @IsEnum(EWeatherPart)
    part?: string;

  @Column({ type: 'json' })
    weatherData: string;

  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;
}
