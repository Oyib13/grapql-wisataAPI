import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDestinasiDto {
  @ApiProperty({ example: 'Pantai Kuta Mandalika' })
  @IsString()
  @Length(4, 191)
  nama!: string;

  @ApiProperty({ example: 'Pantai' })
  @IsString()
  @Length(4, 191)
  kategori!: string;

  @ApiPropertyOptional({ example: 'Lombok Tengah' })
  @IsOptional()
  @IsString()
  @Length(5, 191)
  lokasi?: string;

  @ApiProperty({ example: 15000, minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  hargaTiket!: number;

  @ApiPropertyOptional({ example: 4.5, minimum: 0, maximum: 5 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(5)
  ratingRata?: number;
}