export enum EWeatherPart {
  CURRENT = 'current',
  MINUTELY = 'minutely',
  HOURLY = 'hourly',
  DAILY = 'daily',
  ALERTS = 'alerts',
}

export interface OpenWeatherData {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeather;
  minutely: MinutelyWeather[];
  hourly: HourlyWeather[];
  daily: DailyWeather[];
  alerts: WeatherAlert[];
}

export interface WeatherPeriod {
  dt: number;
  temp?: number | Temperature;
  feels_like?: number | FeelsLike;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi?: number;
  clouds: number;
  visibility?: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: WeatherCondition[];
}

export interface CurrentWeather extends WeatherPeriod {
  sunrise: number;
  sunset: number;
}

export interface MinutelyWeather {
  dt: number;
  precipitation: number;
}

export interface HourlyWeather extends WeatherPeriod {
  pop: number;
  feels_like: number;
}

export interface DailyWeather extends WeatherPeriod {
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  temp: Temperature;
  moon_phase: number;
  summary: string;
  feels_like: FeelsLike;
  pop: number;
  rain?: number;
}

export interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Temperature {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
}

export interface FeelsLike {
  day: number;
  night: number;
  eve: number;
  morn: number;
}
