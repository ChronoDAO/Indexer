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
const fetch = require("fetch-retry")(global.fetch);
function fetchSales(archetypeId, page) {
    return __awaiter(this, void 0, void 0, function* () {
        const pageMaxSize = 1000;
        let olItem;
        let olItemHistoryResponse = yield fetch(`https://openloot.com/api/v2/market/items/transaction/history?archetypeId=${archetypeId}&page=${page}&pageSize=${pageMaxSize}`, {
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
                            olItem = yield response.json();
                            // Check if the JSON is both valid and non-empty
                            if (olItem !== null && Object.keys(olItem).length > 0) {
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
            retryDelay: function (attempt, error, response) {
                let nextIntent;
                if (attempt < 6)
                    nextIntent = 30 * 1000;
                else
                    nextIntent = Math.pow(2, attempt) * 1000; // 1000, 2000, 4000
                console.log(`${archetypeId} retry in ${nextIntent / 1000} seconds`);
                return nextIntent;
            },
        });
        return olItem;
    });
}
exports.default = fetchSales;
