import fetchRetry from "fetch-retry"; //important do not delete
import { getPrismaItemsList } from "./getPrismaTotalItems";
import { addItemToPrisma } from './addItemToPrisma'
import { updateFloorPrice } from "./updateFloorPrice";

const fetch = require("fetch-retry")(global.fetch);

export async function refreshItemsTable(olTotalItems:any) {
  let prismaItemsList = await getPrismaItemsList();
  let olItemsListJson:any;
  const pageMaxSize = 250;
  
  for (let page = 1; page <= Math.ceil(olTotalItems / pageMaxSize); page++) {
    const olItemsList = await fetch(
      `https://api.openloot.com/v2/market/listings?gameId=56a149cf-f146-487a-8a1c-58dc9ff3a15c&page=${page}&pageSize=${pageMaxSize}`,
      {
        retryOn: async function (attempt: any, error: any, response: any) {
      
          // Check if there was an error during the HTTP request
          if (error !== null) {
            console.log(`attempt n°${attempt + 1}`);
            console.log(`${error}`);
            return true;
          }
        
          // Check if the response status indicates success
          if (response.ok) {
            try {
              olItemsListJson = await response.json();
        
              // Check if the JSON is both valid and non-empty
              if (olItemsListJson !== null && Object.keys(olItemsListJson).length > 0) {
                return false;
              } else {
                console.log(`attempt n°${attempt + 1}`);
                console.log(`JSON is empty or invalid.`);
                return true;
              }
            } catch (error) {
              console.log(`attempt n°${attempt + 1}`);
              console.log(`Error caught generating JSON: ${error}`);
              return true;
            }
          } else {
            console.log(`attempt n°${attempt + 1}`);
            console.log(`Response status indicates failure: ${response.status}`);
            return true;
          }
        },
        retries: 50,
      //@ts-ignore 
        retryDelay: function (attempt, error, response) {
          let nextInterval;
          if (attempt < 6) nextInterval = 30 * 1000;
          else nextInterval = Math.pow(2, attempt) * 1000; // 1000, 2000, 4000
          console.log(`Retry in ${nextInterval / 1000} seconds`);
          return nextInterval;
        },
      }
    );
    console.log(`Updating FloorPrice and finding new items in page ${page} / ${Math.ceil(olTotalItems / pageMaxSize)}`)
    // Process the data from olListingItems here
    // let olItemsListJson = await olItemsList.json();

    for (const item of olItemsListJson.items) {
      const archetypeId = item.metadata.archetypeId;

      // Check if the archetypeId is in prismaItemsList
      if (!prismaItemsList.includes(archetypeId)) {
        // The item is not in prismaItemsList, add it to Prisma
        console.log(`${archetypeId} detected, adding it to DB`)
        await addItemToPrisma(item);
      }
      else {
        if (item.minPrice){
          await updateFloorPrice(item);
        } 
      }
    }

    console.log(`FloorPrice updated for all items.`);
  }

  return true;
}


