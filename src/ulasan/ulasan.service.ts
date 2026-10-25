import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUlasanInput } from './dto/create-ulasan.input.js';
import { UpdateUlasanInput } from './dto/update-ulasan.input.js';

@Injectable()
export class UlasanService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(destinasiId?: number) {
    return this.prisma.ulasan.findMany({
      where: destinasiId === undefined ? undefined : { destinasiId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const ulasan = await this.prisma.ulasan.findUnique({ where: { id } });
    if (!ulasan) {
      throw new NotFoundException(`Ulasan dengan id ${id} tidak ditemukan`);
    }
    return ulasan;
  }

  create(input: CreateUlasanInput) {
    return this.prisma.$transaction(async (transaction) => {
      const destinasi = await transaction.destinasi.findUnique({
        where: { id: input.destinasiId },
      });
      if (!destinasi) {
        throw new NotFoundException(
          `Destinasi dengan id ${input.destinasiId} tidak ditemukan`,
        );
      }

      const ulasan = await transaction.ulasan.create({ data: input });
      await this.updateDestinationRating(transaction, input.destinasiId);
      return ulasan;
    });
  }

  update(id: number, input: UpdateUlasanInput) {
    return this.prisma.$transaction(async (transaction) => {
      const existing = await transaction.ulasan.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Ulasan dengan id ${id} tidak ditemukan`);
      }

      const ulasan = await transaction.ulasan.update({
        where: { id },
        data: input,
      });
      await this.updateDestinationRating(transaction, existing.destinasiId);
      return ulasan;
    });
  }

  remove(id: number) {
    return this.prisma.$transaction(async (transaction) => {
      const existing = await transaction.ulasan.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Ulasan dengan id ${id} tidak ditemukan`);
      }

      await transaction.ulasan.delete({ where: { id } });
      await this.updateDestinationRating(transaction, existing.destinasiId);
      return true;
    });
  }

  private async updateDestinationRating(
    transaction: Prisma.TransactionClient,
    destinasiId: number,
  ) {
    const { _avg } = await transaction.ulasan.aggregate({
      where: { destinasiId },
      _avg: { rating: true },
    });

    await transaction.destinasi.update({
      where: { id: destinasiId },
      data: { ratingRata: _avg.rating ?? 0 },
    });
  }
}
