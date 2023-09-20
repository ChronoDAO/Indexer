import fetchRetry from "fetch-retry"; //important do not delete
import prisma from "../prismaRequests/prisma";
import refreshSalesTable from "./refreshSalesTable";
const fetch = require("fetch-retry")(global.fetch);

export async function synchronizeSales() {
  //Second Part :
  const startTime = new Date();
  let items = await prisma.item.findMany({
    orderBy: {
      lastApiPull: "desc",
    },
  });

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    let success = true; // Flag to track if the try block was successful
    console.log(`Processing item ${i + 1} of ${items.length}`);
    try {
     success = await refreshSalesTable(item.archetypeId);
    } catch (error) {
      console.log(`${item.archetypeId} failed to refreshSalesTable`);
      console.log(error);
      success = false; // Set the flag to false when an error is caught
    }

    if (success) {
      // Only update correspondingItem if there were no errors
      let correspondingItem = await prisma.item.update({
        where: { archetypeId: item.archetypeId },
        data: {
          lastApiPull: new Date(),
          synced: true,
        },
      });
      console.log(`${correspondingItem.archetypeId} synced - true `)
    }
  }
  const endTime = new Date();
  const duration = endTime.getTime() - startTime.getTime();
  const durationInMinutes = Math.floor(duration / 60000);
  const leftoverSeconds = (duration % 60000)/1000.0 ; 
  console.log(`Synchronized all new sales in ${durationInMinutes} minutes and ${leftoverSeconds} seconds.`);
}

