"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedGuilds = void 0;
const prisma_1 = __importDefault(require("../prismaRequests/prisma"));
// ADD,UPDATE,REMOVE guilds from here and run this to update guilds in the DB.
const guilds = [
    {
        name: "ChronoDAO",
        tag: "CHR",
        discordUrl: "https://discord.gg/chronodao",
    },
    {
        name: "Vast Impact Gaming",
        tag: "VIG",
        discordUrl: "https://discord.gg/EeQ3g6eMvz",
    },
    {
        name: "RETURNERS",
        tag: "RTN",
        discordUrl: "https://discord.gg/YCVC3exUUw",
    },
    {
        name: "Alpha Origins",
        tag: "AO",
        discordUrl: "https://discord.gg/alphaorigins",
    },
    {
        name: "Big Time Bulls Guild",
        tag: "BTBG",
        discordUrl: "https://discord.gg/nGuPCWdjFS",
    },
    {
        name: "BigTimeWarriors",
        tag: "BTW",
        discordUrl: "https://discord.gg/BigTimeWarriors",
    },
    {
        name: "Gamers United Nation",
        tag: "GUN",
        discordUrl: "https://discord.gg/kr8rmmEgDk",
    },
    {
        name: "FAM",
        tag: "FAM",
        discordUrl: "",
    },
    {
        name: "Dovah Gaming Guild",
        tag: "DGG",
        discordUrl: "https://discord.gg/TQwrfJ2Kwx",
    },
    {
        name: "Space Phoenix Guild",
        tag: "SXG",
        discordUrl: "",
    },
    {
        name: "Yield Guild Games",
        tag: "YGG",
        discordUrl: "https://discord.gg/YGG",
    },
    {
        name: "V Empire Gaming Guild",
        tag: "VEMP",
        discordUrl: "https://discord.gg/vemp",
    },
    {
        name: "X BORG",
        tag: "XB",
        discordUrl: "",
    },
    {
        name: "AMG DAO",
        tag: "AMG",
        discordUrl: "",
    },
    {
        name: "BigTime JPN",
        tag: "BTJ",
        discordUrl: "",
    },
];
function seedGuilds() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch all existing guilds from the database
            const existingGuilds = yield prisma_1.default.guild.findMany();
            // Create a map for efficient look-up
            const existingGuildsMap = {};
            for (const existingGuild of existingGuilds) {
                existingGuildsMap[existingGuild.name] = existingGuild;
            }
            // Iterate through the guilds in the array and handle them
            for (const guild of guilds) {
                const existingGuild = existingGuildsMap[guild.name];
                if (!existingGuild) {
                    // Guild doesn't exist, create a new one
                    yield prisma_1.default.guild.create({
                        data: guild,
                    });
                    console.log(`Added guild: ${guild.name}`);
                }
                else {
                    // Guild exists, update tag and discordUrl if they are different
                    if (existingGuild.tag !== guild.tag ||
                        existingGuild.discordUrl !== guild.discordUrl) {
                        yield prisma_1.default.guild.update({
                            where: {
                                name: guild.name,
                            },
                            data: {
                                tag: guild.tag,
                                discordUrl: guild.discordUrl,
                            },
                        });
                        console.log(`Updated guild: ${guild.name}`);
                    }
                    // Remove the guild from the map to mark it as "handled"
                    delete existingGuildsMap[guild.name];
                }
            }
            // Delete any remaining guilds in the map (not found in the array)
            for (const guildNameToDelete in existingGuildsMap) {
                yield prisma_1.default.guild.delete({
                    where: {
                        name: guildNameToDelete,
                    },
                });
                console.log(`Deleted guild: ${guildNameToDelete}`);
            }
        }
        catch (error) {
            console.error(`Error adding/updating/deleting guilds: ${error.message}`);
        }
        finally {
            console.log('Guilds Updated to match const in seedDatabase');
        }
    });
}
exports.seedGuilds = seedGuilds;
