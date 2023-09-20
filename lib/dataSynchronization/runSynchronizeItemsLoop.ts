import { synchronizeItems } from "./synchronizeItems";
import { delay } from "./delay";

export async function runSynchronizeItemsLoop() {

 while (true) {
  console.log("script synchronizeItems started")
  await synchronizeItems();
  await delay(1000); // Add a delay to avoid constant execution, adjust as needed
  console.log("script synchronizeItems over")
}

}
