/*
  Warnings:

  - The primary key for the `discord_guilds` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `discordGuildId` on the `discord_guilds` table. All the data in the column will be lost.
  - You are about to drop the column `discordGuildName` on the `discord_guilds` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `discord_guilds` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `discord_guilds` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `discord_guilds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `discord_guilds` table without a default value. This is not possible if the table is not empty.

*/


-- AlterTable
ALTER TABLE "discord_guilds"
RENAME COLUMN  "discordGuildId" TO "id";
ALTER TABLE "discord_guilds"
RENAME COLUMN  "discordGuildName" TO "name";

