-- AlterTable
ALTER TABLE `destinasi`
    ADD COLUMN `lokasi` VARCHAR(191) NULL,
    ADD COLUMN `ratingRata` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `hargaTiket` DOUBLE NOT NULL;

-- CreateTable
CREATE TABLE `Ulasan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `destinasiId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `komentar` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fasilitas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `destinasiId` INTEGER NOT NULL,
    `namaFasilitas` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ulasan`
    ADD CONSTRAINT `Ulasan_destinasiId_fkey`
    FOREIGN KEY (`destinasiId`) REFERENCES `destinasi`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fasilitas`
    ADD CONSTRAINT `Fasilitas_destinasiId_fkey`
    FOREIGN KEY (`destinasiId`) REFERENCES `destinasi`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;