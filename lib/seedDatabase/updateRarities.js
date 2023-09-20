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
exports.seedRarities = void 0;
const prisma_1 = __importDefault(require("../prismaRequests/prisma"));
// ADD Rarities here and run this to add it to the DB.
const rarities = [
    { name: "common" },
    { name: "uncommon" },
    { name: "rare" },
    { name: "epic" },
    { name: "legendary" },
    { name: "mythic" },
    { name: "exalted" },
];
function seedRarities() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const rarity of rarities) {
            try {
                const existingRarity = yield prisma_1.default.rarity.findUnique({
                    where: {
                        name: rarity.name,
                    },
                });
                if (!existingRarity) {
                    yield prisma_1.default.rarity.create({
                        data: rarity,
                    });
                    console.log(`Added rarity: ${rarity.name}`);
                }
            }
            catch (error) {
                console.error(`Error adding rarity ${rarity.name}: ${error.message}`);
            }
        }
        console.log("Rarities Updated to match const in seedDatabase");
    });
}
exports.seedRarities = seedRarities;
