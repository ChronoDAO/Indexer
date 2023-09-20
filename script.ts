import { synchronizeItemsLoop } from "./lib/dataSynchronization/synchronizeItemsLoop";
import { synchronizeSalesLoop } from "./lib/dataSynchronization/synchronizeSalesLoop";

export default async function script() {
  // Start both functions concurrently
  await Promise.all([synchronizeItemsLoop(), synchronizeSalesLoop()]);
}

script().catch((error) => {
  console.error("An error occurred:", error);
});
