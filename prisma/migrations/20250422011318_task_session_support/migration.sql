-- AlterTable
ALTER TABLE `Task` ADD COLUMN `type` ENUM('TIMER', 'NUMBER', 'TEXT', 'SELECT') NOT NULL DEFAULT 'TIMER';

-- CreateTable
CREATE TABLE `TaskSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `taskId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NULL,
    `duration` INTEGER NULL,
    `numericInput` INTEGER NULL,
    `textInput` VARCHAR(191) NULL,
    `optionSelected` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TaskSession` ADD CONSTRAINT `TaskSession_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`task_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
