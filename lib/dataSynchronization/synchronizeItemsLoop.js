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
exports.synchronizeItemsLoop = void 0;
const synchronizeItems_1 = require("./synchronizeItems");
const delay_1 = require("./delay");
function synchronizeItemsLoop() {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            console.log("script synchronizeItems started");
            yield (0, synchronizeItems_1.synchronizeItems)();
            yield (0, delay_1.delay)(1000); // Add a delay to avoid constant execution, adjust as needed
            console.log("script synchronizeItems over");
        }
    });
}
exports.synchronizeItemsLoop = synchronizeItemsLoop;
