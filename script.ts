import { runSynchronizeItemsLoop } from "./lib/dataSynchronization/runSynchronizeItemsLoop";
import { runSynchronizeSalesLoop } from "./lib/dataSynchronization/runSynchronizeSalesLoop";

export default async function script() {
  // Start both functions concurrently
  await Promise.all([runSynchronizeItemsLoop(), runSynchronizeSalesLoop()]);
}

script().catch((error) => {
  console.error("An error occurred:", error);
});
