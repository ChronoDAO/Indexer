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
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
function migrateData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let drops = yield prisma.drop.findMany({
                where: {
                    composedId: null,
                },
            });
            let l = drops.length;
            let i = 0;
            for (i = 0; i < drops.length; i++) {
                // Retrieve the associated NFT record based on the nftId
                let drop = drops[i];
                console.log(drop.composedId);
                const nft = yield prisma.NFT.findFirst({
                    where: {
                        id: drop.nftId,
                    },
                });
                // Update the composedId field in the Drop record
                const newdrop = yield prisma.drop.update({
                    where: {
                        id: drop.id,
                    },
                    data: {
                        composedId: nft.composedId,
                    },
                });
                console.log(`${i}/${l}nftid : ${drop.nftId}  new compid: ${newdrop.composedId}`);
            }
            console.log("Data migration completed successfully.");
        }
        catch (error) {
            console.error("Error performing data migration:", error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
migrateData();
