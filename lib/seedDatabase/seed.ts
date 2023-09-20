import { seedRarities } from "./updateRarities";
import { seedCollections } from "./updateCollections";
import { synchronizeItems } from "../dataSynchronization/synchronizeItems";
import { seedGuilds } from "./updateGuilds";
async function seed() {
  await seedCollections();
  await seedRarities();
  await seedGuilds();
  await synchronizeItems();
}
seed();
