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
exports.addItemToPrisma = void 0;
const prisma_1 = __importDefault(require("../prismaRequests/prisma"));
function addItemToPrisma(item) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = {
                archetypeId: item.metadata.archetypeId,
                name: item.metadata.name,
                description: item.metadata.description || null,
                imageUrl: item.metadata.imageUrl || null,
                floorPrice: item.minPrice || null,
                maxIssuance: item.metadata.maxIssuance,
                optionName: item.metadata.optionName,
                rarity: {
                    connect: {
                        name: item.metadata.rarity,
                    },
                },
                collection: {
                    connect: {
                        name: item.metadata.collection,
                    },
                },
                totalTransfers: 0,
                synced: false
            };
            const tags = item.metadata.tags || [];
            // Create an array to store the created or connected tags
            const tagConnections = [];
            // Loop through the tags
            for (const tag of tags) {
                // Try to find an existing tag with the same name
                const existingTag = yield prisma_1.default.tag.findUnique({
                    where: {
                        name: tag,
                    },
                });
                // If the tag exists, connect to it
                if (existingTag) {
                    tagConnections.push({ name: existingTag.name });
                }
                else {
                    // If the tag doesn't exist, create it and connect to it
                    const createdTag = yield prisma_1.default.tag.create({
                        data: {
                            name: tag,
                        },
                    });
                    tagConnections.push({
                        name: createdTag.name,
                    });
                }
            }
            const newItem = yield prisma_1.default.item.create({ data });
            // After item creation, connect the tags to the newItem
            yield prisma_1.default.item.update({
                where: {
                    archetypeId: newItem.archetypeId, // Use the appropriate identifier here
                },
                data: {
                    tags: {
                        connect: tagConnections,
                    },
                },
            });
            console.log(`Item added to Prisma: ${newItem.name}`);
        }
        catch (error) {
            console.error(`Error adding ${item.metadata.name} to Prisma: ${error.message}`);
        }
    });
}
exports.addItemToPrisma = addItemToPrisma;
