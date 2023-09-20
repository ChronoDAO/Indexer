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
const runSynchronizeItemsLoop_1 = require("./lib/dataSynchronization/runSynchronizeItemsLoop");
const runSynchronizeSalesLoop_1 = require("./lib/dataSynchronization/runSynchronizeSalesLoop");
function script() {
    return __awaiter(this, void 0, void 0, function* () {
        // Start both functions concurrently
        yield Promise.all([(0, runSynchronizeItemsLoop_1.runSynchronizeItemsLoop)(), (0, runSynchronizeSalesLoop_1.runSynchronizeSalesLoop)()]);
    });
}
exports.default = script;
script().catch((error) => {
    console.error("An error occurred:", error);
});
