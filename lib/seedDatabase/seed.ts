import { seedRarities } from './updateRarities';
import { seedCollections } from './updateCollections';
import { synchronizeItems } from '../dataSynchronization/synchronizeItems';

seedCollections();
seedRarities();
synchronizeItems();