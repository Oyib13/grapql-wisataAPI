import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { UlasanService } from './ulasan.service.js';

describe('UlasanService', () => {
  const transaction = {
    destinasi: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    ulasan: {
      aggregate: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  } as unknown as Prisma.TransactionClient;
  const prisma = {
    $transaction: vi.fn(),
    ulasan: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  } as unknown as PrismaService;
  const service = new UlasanService(prisma);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.$transaction).mockImplementation(
      ((callback: (tx: Prisma.TransactionClient) => Promise<unknown>) =>
        callback(transaction)) as PrismaService['$transaction'],
    );
  });

  it('filters reviews by destination and sorts newest first', async () => {
    await service.findAll(3);

    expect(prisma.ulasan.findMany).toHaveBeenCalledWith({
      where: { destinasiId: 3 },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('creates a review and updates the destination average in one transaction', async () => {
    const input = { destinasiId: 3, rating: 4, komentar: 'Tempat yang bagus' };
    const ulasan = { id: 1, ...input };
    vi.mocked(transaction.destinasi.findUnique).mockResolvedValue({ id: 3 });
    vi.mocked(transaction.ulasan.create).mockResolvedValue(ulasan);
    vi.mocked(transaction.ulasan.aggregate).mockResolvedValue({
      _avg: { rating: 4 },
    } as never);
    vi.mocked(transaction.destinasi.update).mockResolvedValue({} as never);

    await expect(service.create(input)).resolves.toEqual(ulasan);
    expect(transaction.destinasi.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: { ratingRata: 4 },
    });
  });

  it('rejects a review for a destination that does not exist', async () => {
    vi.mocked(transaction.destinasi.findUnique).mockResolvedValue(null);

    await expect(
      service.create({ destinasiId: 999, rating: 5, komentar: 'Bagus' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(transaction.ulasan.create).not.toHaveBeenCalled();
  });

  it('updates a review and recalculates its destination average', async () => {
    const existing = {
      id: 1,
      destinasiId: 3,
      rating: 3,
      komentar: 'Lumayan',
      createdAt: new Date(),
    };
    const updated = { ...existing, rating: 5 };
    vi.mocked(transaction.ulasan.findUnique).mockResolvedValue(existing);
    vi.mocked(transaction.ulasan.update).mockResolvedValue(updated);
    vi.mocked(transaction.ulasan.aggregate).mockResolvedValue({
      _avg: { rating: 4 },
    } as never);
    vi.mocked(transaction.destinasi.update).mockResolvedValue({} as never);

    await expect(service.update(1, { rating: 5 })).resolves.toEqual(updated);
    expect(transaction.destinasi.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: { ratingRata: 4 },
    });
  });

  it('updates the average after deleting a review', async () => {
    vi.mocked(transaction.ulasan.findUnique).mockResolvedValue({
      id: 1,
      destinasiId: 3,
      rating: 5,
      komentar: 'Bagus',
      createdAt: new Date(),
    });
    vi.mocked(transaction.ulasan.delete).mockResolvedValue({} as never);
    vi.mocked(transaction.ulasan.aggregate).mockResolvedValue({
      _avg: { rating: null },
    } as never);
    vi.mocked(transaction.destinasi.update).mockResolvedValue({} as never);

    await expect(service.remove(1)).resolves.toBe(true);
    expect(transaction.destinasi.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: { ratingRata: 0 },
    });
  });
});
