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
exports.updateFloorPrice = void 0;
const prisma_1 = __importDefault(require("../prismaRequests/prisma"));
// This is used by synchronizedata, not standalone.
function updateFloorPrice(givenItem) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Find the item with the specified archetypeId
            const prismaItem = yield prisma_1.default.item.findUnique({
                where: { archetypeId: givenItem.metadata.archetypeId },
            });
            if (!prismaItem) {
                throw new Error(`Item with archetypeId ${givenItem.archetypeId} not found.`);
            }
            // Update the floorPrice with the value from givenItem.minPrice
            const updatedItem = yield prisma_1.default.item.update({
                where: { archetypeId: givenItem.metadata.archetypeId },
                data: {
                    floorPrice: givenItem.minPrice,
                },
            });
            // Return the updated item if needed
            return;
        }
        catch (error) {
            console.error(`Error updating floorPrice: ${error.message}`);
        }
    });
}
exports.updateFloorPrice = updateFloorPrice;
