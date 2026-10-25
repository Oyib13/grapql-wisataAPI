import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { DestinasiService } from './destinasi.service.js';

describe('DestinasiService', () => {
  const destination = {
    id: 1,
    nama: 'Pantai Kuta Mandalika',
    kategori: 'Pantai',
    lokasi: null,
    hargaTiket: 15000,
    ratingRata: 0,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };
  const prisma = {
    destinasi: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  } as unknown as PrismaService;
  const service = new DestinasiService(prisma);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('filters by category and sorts newest first', async () => {
    prisma.destinasi.findMany = vi.fn().mockResolvedValue([destination]);

    await service.findAll('Pantai');

    expect(prisma.destinasi.findMany).toHaveBeenCalledWith({
      where: { kategori: 'Pantai' },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('throws NotFoundException when a destination does not exist', async () => {
    prisma.destinasi.findUnique = vi.fn().mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('creates a destination', async () => {
    const data = {
      nama: destination.nama,
      kategori: destination.kategori,
      hargaTiket: destination.hargaTiket,
    };
    prisma.destinasi.create = vi.fn().mockResolvedValue(destination);

    await service.create(data);

    expect(prisma.destinasi.create).toHaveBeenCalledWith({ data });
  });

  it('updates only after confirming the destination exists', async () => {
    const data = { kategori: 'Wisata Pantai' };
    prisma.destinasi.findUnique = vi.fn().mockResolvedValue(destination);
    prisma.destinasi.update = vi.fn().mockResolvedValue({
      ...destination,
      ...data,
    });

    await service.update(1, data);

    expect(prisma.destinasi.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data,
    });
  });

  it('deletes and returns a success message', async () => {
    prisma.destinasi.findUnique = vi.fn().mockResolvedValue(destination);
    prisma.destinasi.delete = vi.fn().mockResolvedValue(destination);

    await expect(service.remove(1)).resolves.toEqual({
      message: 'Destinasi berhasil dihapus',
    });
    expect(prisma.destinasi.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});