import { synchronizeSales } from "./synchronizeSales";
import { delay } from "./delay";

export async function runSynchronizeSalesLoop() {
 
 while (true) {
  console.log("script synchronizeSales started")
  await synchronizeSales();
  await delay(1000); // Add a delay to avoid constant execution, adjust as needed
  console.log("script synchronizeSales over")
}
 
}

