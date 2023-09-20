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
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshItemsTable = void 0;
const getPrismaTotalItems_1 = require("./getPrismaTotalItems");
const addItemToPrisma_1 = require("./addItemToPrisma");
const updateFloorPrice_1 = require("./updateFloorPrice");
const fetch = require("fetch-retry")(global.fetch);
function refreshItemsTable(olTotalItems) {
    return __awaiter(this, void 0, void 0, function* () {
        let prismaItemsList = yield (0, getPrismaTotalItems_1.getPrismaItemsList)();
        let olItemsListJson;
        const pageMaxSize = 250;
        for (let page = 1; page <= Math.ceil(olTotalItems / pageMaxSize); page++) {
            const olItemsList = yield fetch(`https://openloot.com/api/v2/market/listings?gameId=56a149cf-f146-487a-8a1c-58dc9ff3a15c&page=${page}&pageSize=${pageMaxSize}`, {
                retryOn: function (attempt, error, response) {
                    return __awaiter(this, void 0, void 0, function* () {
                        // Check if there was an error during the HTTP request
                        if (error !== null) {
                            console.log(`attempt n°${attempt + 1}`);
                            console.log(`${error}`);
                            return true;
                        }
                        // Check if the response status indicates success
                        if (response.ok) {
                            try {
                                olItemsListJson = yield response.json();
                                // Check if the JSON is both valid and non-empty
                                if (olItemsListJson !== null && Object.keys(olItemsListJson).length > 0) {
                                    return false;
                                }
                                else {
                                    console.log(`attempt n°${attempt + 1}`);
                                    console.log(`JSON is empty or invalid.`);
                                    return true;
                                }
                            }
                            catch (error) {
                                console.log(`attempt n°${attempt + 1}`);
                                console.log(`Error caught generating JSON: ${error}`);
                                return true;
                            }
                        }
                        else {
                            console.log(`attempt n°${attempt + 1}`);
                            console.log(`Response status indicates failure: ${response.status}`);
                            return true;
                        }
                    });
                },
                retries: 50,
                //@ts-ignore 
                retryDelay: function (attempt, error, response) {
                    let nextInterval;
                    if (attempt < 6)
                        nextInterval = 30 * 1000;
                    else
                        nextInterval = Math.pow(2, attempt) * 1000; // 1000, 2000, 4000
                    console.log(`Retry in ${nextInterval / 1000} seconds`);
                    return nextInterval;
                },
            });
            console.log(`Updating FloorPrice and finding new items in page ${page} / ${Math.ceil(olTotalItems / pageMaxSize)}`);
            // Process the data from olListingItems here
            // let olItemsListJson = await olItemsList.json();
            for (const item of olItemsListJson.items) {
                const archetypeId = item.metadata.archetypeId;
                // Check if the archetypeId is in prismaItemsList
                if (!prismaItemsList.includes(archetypeId)) {
                    // The item is not in prismaItemsList, add it to Prisma
                    console.log(`${archetypeId} detected, adding it to DB`);
                    yield (0, addItemToPrisma_1.addItemToPrisma)(item);
                }
                else {
                    if (item.minPrice) {
                        yield (0, updateFloorPrice_1.updateFloorPrice)(item);
                    }
                }
            }
            console.log(`FloorPrice updated for all items.`);
        }
        return true;
    });
}
exports.refreshItemsTable = refreshItemsTable;
