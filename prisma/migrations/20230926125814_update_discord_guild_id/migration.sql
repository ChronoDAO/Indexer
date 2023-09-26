/*
  Warnings:

  - The primary key for the `discord_guilds` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `discord_guilds` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DiscordGuildToUser" DROP CONSTRAINT "_DiscordGuildToUser_A_fkey";

-- AlterTable
ALTER TABLE "_DiscordGuildToUser" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "discord_guilds" DROP CONSTRAINT "discord_guilds_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "discord_guilds_pkey" PRIMARY KEY ("discordGuildId");

-- AddForeignKey
ALTER TABLE "_DiscordGuildToUser" ADD CONSTRAINT "_DiscordGuildToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "discord_guilds"("discordGuildId") ON DELETE CASCADE ON UPDATE CASCADE;
