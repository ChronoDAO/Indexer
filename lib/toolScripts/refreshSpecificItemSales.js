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
exports.refreshItemSales = void 0;
const prisma_1 = __importDefault(require("../prismaRequests/prisma"));
const refreshSalesTable_1 = __importDefault(require("../dataSynchronization/refreshSalesTable"));
function refreshItemSales() {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the argument provided after the script name
        const archetypeId = process.argv[2];
        // Check if the argument is provided
        if (!archetypeId) {
            console.error('You need to give an archetypeId at the end of your code.');
            process.exit(1); // Exit with an error code
        }
        const item = yield prisma_1.default.item.findFirst({
            where: { archetypeId: archetypeId }
        });
        if (!item) {
            console.error(`The item associated to your archetypeId : ${archetypeId} can't be found`);
            process.exit(1); // Exit with an error code
        }
        // Now, you can use the `archetypeId` variable in your function
        yield (0, refreshSalesTable_1.default)(archetypeId);
    });
}
exports.refreshItemSales = refreshItemSales;
refreshItemSales();
