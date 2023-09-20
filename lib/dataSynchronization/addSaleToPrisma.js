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
exports.addSaleToPrisma = void 0;
const prisma_1 = __importDefault(require("../prismaRequests/prisma"));
function addSaleToPrisma(newSale) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let sale;
            if (newSale.price == null)
                newSale.price = 0;
            try {
                sale = yield prisma_1.default.sale.create({
                    data: {
                        transactionId: `[${newSale.issuedId}]${newSale.archetypeId}-${newSale.date}`,
                        price: newSale.price,
                        date: new Date(newSale.date),
                        from: {
                            connectOrCreate: {
                                where: {
                                    name: newSale.fromUser,
                                },
                                create: {
                                    name: newSale.fromUser,
                                    sold: newSale.price,
                                },
                            },
                        },
                        to: {
                            connectOrCreate: {
                                where: {
                                    name: newSale.toUser,
                                },
                                create: {
                                    name: newSale.toUser,
                                },
                            },
                        },
                        nft: {
                            connectOrCreate: {
                                where: {
                                    composedId: `[${newSale.issuedId}]${newSale.archetypeId}`,
                                },
                                create: {
                                    composedId: `[${newSale.issuedId}]${newSale.archetypeId}`,
                                    issuedId: newSale.issuedId,
                                    item: {
                                        connect: {
                                            archetypeId: newSale.archetypeId,
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
            }
            catch (error) {
                console.log(`error in addSaleToPrisma with [${newSale.issuedId}]${newSale.archetypeId}-${newSale.date} : ${error}`);
                return false; // Bypass update to Players and nfts since sale failed
            }
            let fromPlayer = yield prisma_1.default.player.update({
                where: {
                    name: sale.fromPlayer,
                },
                data: {
                    balance: { increment: sale.price },
                    sold: { increment: sale.price },
                },
            });
            let toPlayer = yield prisma_1.default.player.update({
                where: { name: sale.toPlayer },
                data: {
                    balance: { decrement: sale.price },
                    spent: { increment: sale.price },
                },
            });
            let correspondingNft = yield prisma_1.default.nFT.update({
                where: { composedId: sale.nftId },
                data: {
                    ownerName: sale.toPlayer,
                },
            });
            let correspondingItem = yield prisma_1.default.item.update({
                where: { archetypeId: newSale.archetypeId },
                data: {
                    totalTransfers: { increment: 1 },
                },
            });
        }
        catch (error) {
            console.log(`error in addSaleToPrisma with [${newSale.issuedId}]${newSale.archetypeId} while updating player/nft/totalTransfers : ${error}`);
            return false;
        }
        return true;
    });
}
exports.addSaleToPrisma = addSaleToPrisma;
