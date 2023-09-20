import { getOLTotalItems } from "./getOLTotalItems";
import { getPrismaTotalItems } from "./getPrismaTotalItems";
import { refreshItemsTable } from "./refreshItemsTable";


export async function synchronizeItems() {
  // First part :
  const startTime = new Date();
  let olTotalItems = await getOLTotalItems();
  let prismaTotalItems = await getPrismaTotalItems();
  console.log(`Total number of items in the database: ${prismaTotalItems}`);
  console.log(`Total number of items on OL listings API: ${olTotalItems}`);
  if (olTotalItems < prismaTotalItems) {
    console.log(
      `Inferior number of Items detected (${
        olTotalItems - prismaTotalItems
      }), identify the error in our db before running the synchronization again.`
    );
    return;
  }
  console.log(
    `${
      olTotalItems - prismaTotalItems
    } new Item(s) detected. Refreshing Items Table now.`
  );
  await refreshItemsTable(olTotalItems);
  const endTime = new Date();
  const duration = endTime.getTime() - startTime.getTime();
  const durationInMinutes = Math.floor(duration / 60000);
  const leftoverSeconds = (duration % 60000)/1000.0 ; 
  console.log(`Synchronized all items in ${durationInMinutes} minutes and ${leftoverSeconds} seconds.`);

}




