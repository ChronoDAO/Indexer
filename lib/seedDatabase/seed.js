"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updateRarities_1 = require("./updateRarities");
const updateCollections_1 = require("./updateCollections");
const synchronizeItems_1 = require("../dataSynchronization/synchronizeItems");
(0, updateCollections_1.seedCollections)();
(0, updateRarities_1.seedRarities)();
(0, synchronizeItems_1.synchronizeItems)();
