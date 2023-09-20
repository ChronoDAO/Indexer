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
exports.synchronizeItems = void 0;
const getOLTotalItems_1 = require("./getOLTotalItems");
const getPrismaTotalItems_1 = require("./getPrismaTotalItems");
const refreshItemsTable_1 = require("./refreshItemsTable");
function synchronizeItems() {
    return __awaiter(this, void 0, void 0, function* () {
        // First part :
        const startTime = new Date();
        let olTotalItems = yield (0, getOLTotalItems_1.getOLTotalItems)();
        let prismaTotalItems = yield (0, getPrismaTotalItems_1.getPrismaTotalItems)();
        console.log(`Total number of items in the database: ${prismaTotalItems}`);
        console.log(`Total number of items on OL listings API: ${olTotalItems}`);
        if (olTotalItems < prismaTotalItems) {
            console.log(`Inferior number of Items detected (${olTotalItems - prismaTotalItems}), identify the error in our db before running the synchronization again.`);
            return;
        }
        console.log(`${olTotalItems - prismaTotalItems} new Item(s) detected. Refreshing Items Table now.`);
        yield (0, refreshItemsTable_1.refreshItemsTable)(olTotalItems);
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        const durationInMinutes = Math.floor(duration / 60000);
        const leftoverSeconds = (duration % 60000) / 1000.0;
        console.log(`Synchronized all items in ${durationInMinutes} minutes and ${leftoverSeconds} seconds.`);
    });
}
exports.synchronizeItems = synchronizeItems;
