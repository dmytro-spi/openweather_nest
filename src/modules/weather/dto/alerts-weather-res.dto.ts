import { ApiProperty } from '@nestjs/swagger';

export class WeatherAlertResponseDto {
  @ApiProperty({ description: 'Name of the sender' })
    sender_name: string;

  @ApiProperty({ description: 'Event type' })
    event: string;

  @ApiProperty({ description: 'Start time in Unix timestamp', example: 1684952747 })
    start: number;

  @ApiProperty({ description: 'End time in Unix timestamp', example: 1684988747 })
    end: number;

  @ApiProperty({ description: 'Description of the alert' })
    description: string;

  @ApiProperty({ description: 'Tags associated with the alert', example: [] })
    tags: string[];
}
