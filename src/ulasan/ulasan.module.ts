import { Module } from '@nestjs/common';
import { UlasanResolver } from './ulasan.resolver.js';
import { UlasanService } from './ulasan.service.js';

@Module({
  providers: [UlasanResolver, UlasanService],
})
export class UlasanModule {}
