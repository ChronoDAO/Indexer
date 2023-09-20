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
function updateBalancesToZero() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedPlayers = yield prisma_1.default.player.updateMany({
                where: {},
                data: {
                    balance: 0,
                    spent: 0,
                    sold: 0,
                },
            });
            console.log(`${updatedPlayers.count} players have been updated.`);
        }
        catch (error) {
            console.error('Error updating balances:', error);
        }
        finally {
            yield prisma_1.default.$disconnect();
        }
    });
}
updateBalancesToZero();
