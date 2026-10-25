import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateDestinasiDto } from './dto/create-destinasi.dto.js';
import { UpdateDestinasiDto } from './dto/update-destinasi.dto.js';

@Injectable()
export class DestinasiService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(kategori?: string) {
    return this.prisma.destinasi.findMany({
      where: kategori ? { kategori } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const destinasi = await this.prisma.destinasi.findUnique({
      where: { id },
    });
    if (!destinasi) {
      throw new NotFoundException(`Destinasi dengan id ${id} tidak ditemukan`);
    }
    return destinasi;
  }

  create(dto: CreateDestinasiDto) {
    return this.prisma.destinasi.create({ data: dto });
  }

  async update(id: number, dto: UpdateDestinasiDto) {
    await this.findOne(id);
    return this.prisma.destinasi.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.destinasi.delete({ where: { id } });
    return { message: 'Destinasi berhasil dihapus' };
  }
}