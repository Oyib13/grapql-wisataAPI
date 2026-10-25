import { Module } from '@nestjs/common';
import { DestinasiController } from './destinasi.controller.js';
import { DestinasiService } from './destinasi.service.js';
import { DestinasiResolver } from './destinasi.resolver.js';

@Module({
  controllers: [DestinasiController],
  providers: [DestinasiService, DestinasiResolver],
})
export class DestinasiModule {}