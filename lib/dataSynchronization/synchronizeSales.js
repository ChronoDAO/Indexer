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
exports.synchronizeSales = void 0;
const prisma_1 = __importDefault(require("../prismaRequests/prisma"));
const refreshSalesTable_1 = __importDefault(require("./refreshSalesTable"));
const fetch = require("fetch-retry")(global.fetch);
function synchronizeSales() {
    return __awaiter(this, void 0, void 0, function* () {
        //Second Part :
        const startTime = new Date();
        let items = yield prisma_1.default.item.findMany({
            orderBy: {
                lastApiPull: "desc",
            },
        });
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            let success = true; // Flag to track if the try block was successful
            console.log(`Processing item ${i + 1} of ${items.length}`);
            try {
                success = yield (0, refreshSalesTable_1.default)(item.archetypeId);
            }
            catch (error) {
                console.log(`${item.archetypeId} failed to refreshSalesTable`);
                console.log(error);
                success = false; // Set the flag to false when an error is caught
            }
            if (success) {
                // Only update correspondingItem if there were no errors
                let correspondingItem = yield prisma_1.default.item.update({
                    where: { archetypeId: item.archetypeId },
                    data: {
                        lastApiPull: new Date(),
                        synced: true,
                    },
                });
                console.log(`${correspondingItem.archetypeId} synced - true `);
            }
        }
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        const durationInMinutes = Math.floor(duration / 60000);
        const leftoverSeconds = (duration % 60000) / 1000.0;
        console.log(`Synchronized all new sales in ${durationInMinutes} minutes and ${leftoverSeconds} seconds.`);
    });
}
exports.synchronizeSales = synchronizeSales;
