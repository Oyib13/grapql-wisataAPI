import { PartialType } from '@nestjs/swagger';
import { CreateDestinasiDto } from './create-destinasi.dto.js';

export class UpdateDestinasiDto extends PartialType(CreateDestinasiDto) {}