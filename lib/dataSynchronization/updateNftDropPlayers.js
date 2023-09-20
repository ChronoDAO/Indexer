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
const prisma_1 = __importDefault(require("../prismaRequests/prisma"));
function updateNFTOwners() {
    return __awaiter(this, void 0, void 0, function* () {
        const nfts = yield prisma_1.default.nFT.findMany({
            where: {
                ownerName: null,
                drops: {
                    some: {}
                },
            },
            include: {
                drops: {
                    select: {
                        date: true,
                        to: {
                            select: {
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        date: 'desc', // Order drops by date in descending order to get the most recent one.
                    },
                    take: 1, // Only get the most recent drop.
                },
            },
        });
        let i = 1;
        for (const nft of nfts) {
            if (nft.drops.length > 0 && nft.drops[0].to.name) {
                const playerName = nft.drops[0].to.name;
                yield prisma_1.default.nFT.update({
                    where: {
                        id: nft.id,
                    },
                    data: {
                        ownerName: playerName,
                    },
                });
                console.log(`Updated ownerName for NFT ${i} / ${nfts.length} `);
                i++;
            }
        }
    });
}
updateNFTOwners()
    .catch((error) => {
    throw error;
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.$disconnect();
}));
