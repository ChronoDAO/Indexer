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
const addSaleToPrisma_1 = require("./addSaleToPrisma");
const fetch = require("fetch-retry")(global.fetch);
const delay_1 = require("./delay");
const fetchSales_1 = __importDefault(require("./fetchSales"));
function refreshSalesTable(archetypeId) {
    return __awaiter(this, void 0, void 0, function* () {
        let success = true;
        let olItem;
        olItem = yield (0, fetchSales_1.default)(archetypeId, 1);
        let item = yield prisma_1.default.item.findUnique({
            where: { archetypeId },
        });
        // Checking data is relevant and calls are successfull
        if (!olItem) {
            console.log(`Couldnt request ${archetypeId} in OL API. Skipping all transactions operations related to the item.`);
            success = false;
            return success;
        }
        if (!item) {
            console.log(`Couldnt find matching item to ${archetypeId} in our db. Skipping all transactions operations related to the item. Please contact admin`);
            success = false;
            return success;
        }
        let nbNewTransactions = olItem.totalItems - item.totalTransfers;
        let i;
        yield (0, delay_1.delay)(50);
        switch (true) {
            case nbNewTransactions < 0:
                console.log(`${archetypeId} has more entries in our db. Skipping all transactions operations related to the item.`);
                success = false;
                break;
            case nbNewTransactions == 0:
                yield prisma_1.default.item.update({
                    where: { archetypeId },
                    data: {
                        lastApiPull: new Date(),
                        synced: true,
                    },
                });
                console.log(`${archetypeId} - No new transactions `);
                success = true;
                break;
            case nbNewTransactions < 1000:
                console.log(`${archetypeId}  ${nbNewTransactions} new sales detected, updating our DB `);
                // loop from the oldest unknown transaction as they are sorted by dates
                let prismaDataSalesTable = [];
                for (i = nbNewTransactions - 1; i >= 0; i--) {
                    let newSale = olItem.items[i];
                    const startTime = new Date();
                    yield (0, delay_1.delay)(50);
                    try {
                        success = yield (0, addSaleToPrisma_1.addSaleToPrisma)(newSale);
                    }
                    catch (error) {
                        success = false;
                    }
                    if (success == false) {
                        console.log(`${newSale.archetypeId} failed to update a sale, skipping this item, to preserve accuracy.`);
                        break;
                    }
                    else {
                        console.log(` [${newSale.issuedId}]${newSale.archetypeId}-${newSale.date} | ${i}/${nbNewTransactions} `);
                    }
                    const endTime = new Date();
                    const duration = endTime.getTime() - startTime.getTime();
                    const durationInMinutes = Math.floor(duration / 60000);
                    const leftoverSeconds = (duration % 60000) / 1000.0;
                    console.log(`Updated sale in ${durationInMinutes} minutes and ${leftoverSeconds} seconds. with delay of 200ms`);
                }
                break;
            case nbNewTransactions > 1000:
                //Need to get all the new sales, first one i already have
                // So i loop all full pages then get the remainder one.
                // if between 1000 and 2000 loop wont run etc...
                console.log(`${archetypeId}  ${nbNewTransactions} new sales detected, updating our DB `);
                const nbWholePages = nbNewTransactions / 1000.0;
                for (i = 2; i < nbWholePages; i++) {
                    // let PartialHistoryResponse = await fetch(
                    //   `https://openloot.com/api/v2/market/items/transaction/history?archetypeId=${archetypeId}&page=${i}&pageSize=${pageMaxSize}`,
                    //   {
                    //     retryOn: [0],
                    //     retries: 50,
                    //     retryDelay: function (attempt: any, error: any, response: any) {
                    //       let nextIntent;
                    //       if (attempt < 6) nextIntent = 30 * 1000;
                    //       else nextIntent = Math.pow(2, attempt) * 1000; // 1000, 2000, 4000
                    //       console.log(
                    //         `${archetypeId} retry in ${nextIntent / 1000} seconds`
                    //       );
                    //       return nextIntent;
                    //     },
                    //   }
                    // );
                    // let newResponse: any = await PartialHistoryResponse.json();
                    let newResponse = yield (0, fetchSales_1.default)(archetypeId, i);
                    olItem.items = olItem.items.concat(newResponse.items);
                }
                // Now the final loop with <1000 newSales
                // let PartialHistoryResponse = await fetch(
                //   `https://openloot.com/api/v2/market/items/transaction/history?archetypeId=${archetypeId}&page=${Math.ceil(
                //     nbWholePages
                //   )}&pageSize=${pageMaxSize}`,
                //   {
                //     retryOn: [0],
                //     retries: 50,
                //     retryDelay: function (attempt: any, error: any, response: any) {
                //       let nextIntent;
                //       if (attempt < 6) nextIntent = 30 * 1000;
                //       else nextIntent = Math.pow(2, attempt) * 1000; // 1000, 2000, 4000
                //       console.log(`${archetypeId} retry in ${nextIntent / 1000} seconds`);
                //       return nextIntent;
                //     },
                //   }
                // );
                // let newResponse: any = await PartialHistoryResponse.json();
                let newResponse = (0, fetchSales_1.default)(archetypeId, Math.ceil(nbWholePages));
                olItem.items = olItem.items.concat(newResponse.items);
                // Now adding them all to prisma
                for (i = nbNewTransactions - 1; i >= 0; i--) {
                    let newSale = olItem.items[i];
                    const startTime = new Date();
                    yield (0, delay_1.delay)(50);
                    try {
                        success = yield (0, addSaleToPrisma_1.addSaleToPrisma)(newSale);
                    }
                    catch (error) {
                        success = false;
                    }
                    if (success == false) {
                        console.log(`${newSale.archetypeId} failed to update a sale, skipping this item, to preserve accuracy.`);
                        break;
                    }
                    else {
                        console.log(` [${newSale.issuedId}]${newSale.archetypeId}-${newSale.date} | ${i}/${nbNewTransactions} `);
                    }
                    const endTime = new Date();
                    const duration = endTime.getTime() - startTime.getTime();
                    const durationInMinutes = Math.floor(duration / 60000);
                    const leftoverSeconds = (duration % 60000) / 1000.0;
                    console.log(`Updated sale in ${durationInMinutes} minutes and ${leftoverSeconds} seconds. with delay of 200ms`);
                }
                break;
            default:
                console.log(`Unexpected scenario while trying to get new transactions for ${archetypeId}`);
                break;
        }
        return success;
    });
}
exports.default = refreshSalesTable;
