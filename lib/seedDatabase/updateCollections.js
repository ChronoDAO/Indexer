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
exports.seedCollections = void 0;
const prisma_1 = __importDefault(require("../prismaRequests/prisma"));
// ADD Collections here and run this to add it to the DB.
const collections = [
    { name: "BT0" },
];
function seedCollections() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const collection of collections) {
            try {
                const existingCollection = yield prisma_1.default.collection.findUnique({
                    where: {
                        name: collection.name,
                    },
                });
                if (!existingCollection) {
                    yield prisma_1.default.collection.create({
                        data: collection,
                    });
                    console.log(`Added collection: ${collection.name}`);
                }
                else {
                    console.log(`collection ${collection.name} already exists, skipping.`);
                }
            }
            catch (error) {
                console.error(`Error adding collection ${collection.name}: ${error.message}`);
            }
        }
    });
}
exports.seedCollections = seedCollections;
