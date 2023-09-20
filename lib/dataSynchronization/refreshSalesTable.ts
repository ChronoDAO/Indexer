import prisma from "../prismaRequests/prisma";
import { addSaleToPrisma } from "./addSaleToPrisma";
import fetchRetry from "fetch-retry"; //important do not delete
const fetch = require("fetch-retry")(global.fetch);
import { delay } from "./delay";
import fetchSales from "./fetchSales";

export default async function refreshSalesTable(archetypeId: string) {
  let success = true;
  let olItem: any;
  olItem = await fetchSales(archetypeId,1);
  let item = await prisma.item.findUnique({
    where: { archetypeId },
  });
  // Checking data is relevant and calls are successfull
  if (!olItem) {
    console.log(
      `Couldnt request ${archetypeId} in OL API. Skipping all transactions operations related to the item.`
    );
    success = false;
    return success;
  }
  if (!item) {
    console.log(
      `Couldnt find matching item to ${archetypeId} in our db. Skipping all transactions operations related to the item. Please contact admin`
    );
    success = false;
    return success;
  }
  let nbNewTransactions: number = olItem.totalItems - item.totalTransfers;
  let i: number;
  await delay(50);
  switch (true) {
    case nbNewTransactions < 0:
      console.log(
        `${archetypeId} has more entries in our db. Skipping all transactions operations related to the item.`
      );
      success = false;
      break;

    case nbNewTransactions == 0:
      await prisma.item.update({
        where: { archetypeId },
        data: {
          lastApiPull: new Date(),
          synced: true,
        },
      });

      console.log(`${archetypeId} - No new transactions `);
      success = true;
      break;

    case nbNewTransactions < 1000:
      console.log(
        `${archetypeId}  ${nbNewTransactions} new sales detected, updating our DB `
      );
      // loop from the oldest unknown transaction as they are sorted by dates
      let prismaDataSalesTable: any = [];
      for (i = nbNewTransactions - 1; i >= 0; i--) {
        let newSale = olItem.items[i];
        const startTime = new Date();
        await delay(50);
        try {
          success = await addSaleToPrisma(newSale);
        } catch (error) {
          success = false;
        }
        if (success == false) {
          console.log(
            `${newSale.archetypeId} failed to update a sale, skipping this item, to preserve accuracy.`
          );
          break;
        } else {
          console.log(
            ` [${newSale.issuedId}]${newSale.archetypeId}-${newSale.date} | ${i}/${nbNewTransactions} `
          );
        }
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        const durationInMinutes = Math.floor(duration / 60000);
        const leftoverSeconds = (duration % 60000) / 1000.0;
        console.log(
          `Updated sale in ${durationInMinutes} minutes and ${leftoverSeconds} seconds. with delay of 200ms`
        );
      }

      break;

    case nbNewTransactions > 1000:
      //Need to get all the new sales, first one i already have
      // So i loop all full pages then get the remainder one.
      // if between 1000 and 2000 loop wont run etc...
      console.log(
        `${archetypeId}  ${nbNewTransactions} new sales detected, updating our DB `
      );
      const nbWholePages = nbNewTransactions / 1000.0;

      for (i = 2; i < nbWholePages; i++) {
        // let PartialHistoryResponse = await fetch(
        //   `https://openloot.com/api/v2/market/items/transaction/history?archetypeId=${archetypeId}&page=${i}&pageSize=${pageMaxSize}`,
        //   {
        //     retryOn: [0],
        //     retries: 50,

        //     retryDelay: function (attempt: any, error: any, response: any) {
        //       let nextIntent;
        //       if (attempt < 6) nextIntent = 30 * 1000;
        //       else nextIntent = Math.pow(2, attempt) * 1000; // 1000, 2000, 4000
        //       console.log(
        //         `${archetypeId} retry in ${nextIntent / 1000} seconds`
        //       );
        //       return nextIntent;
        //     },
        //   }
        // );
        // let newResponse: any = await PartialHistoryResponse.json();
        let newResponse:any = await fetchSales(archetypeId,i);
        olItem.items = olItem.items.concat(newResponse.items);
      }
      // Now the final loop with <1000 newSales
      // let PartialHistoryResponse = await fetch(
      //   `https://openloot.com/api/v2/market/items/transaction/history?archetypeId=${archetypeId}&page=${Math.ceil(
      //     nbWholePages
      //   )}&pageSize=${pageMaxSize}`,
      //   {
      //     retryOn: [0],
      //     retries: 50,

      //     retryDelay: function (attempt: any, error: any, response: any) {
      //       let nextIntent;
      //       if (attempt < 6) nextIntent = 30 * 1000;
      //       else nextIntent = Math.pow(2, attempt) * 1000; // 1000, 2000, 4000
      //       console.log(`${archetypeId} retry in ${nextIntent / 1000} seconds`);
      //       return nextIntent;
      //     },
      //   }
      // );
      // let newResponse: any = await PartialHistoryResponse.json();
      let newResponse:any = fetchSales(archetypeId,Math.ceil(
        nbWholePages
      ))
      olItem.items = olItem.items.concat(newResponse.items);

      // Now adding them all to prisma
      for (i = nbNewTransactions - 1; i >= 0; i--) {
        let newSale = olItem.items[i];
        const startTime = new Date();
        await delay(50);

        try {
          success = await addSaleToPrisma(newSale);
        } catch (error) {
          success = false;
        }
        if (success == false) {
          console.log(
            `${newSale.archetypeId} failed to update a sale, skipping this item, to preserve accuracy.`
          );
          break;
        } else {
          console.log(
            ` [${newSale.issuedId}]${newSale.archetypeId}-${newSale.date} | ${i}/${nbNewTransactions} `
          );
        }
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        const durationInMinutes = Math.floor(duration / 60000);
        const leftoverSeconds = (duration % 60000) / 1000.0;
        console.log(
          `Updated sale in ${durationInMinutes} minutes and ${leftoverSeconds} seconds. with delay of 200ms`
        );
      }

      break;

    default:
      console.log(
        `Unexpected scenario while trying to get new transactions for ${archetypeId}`
      );
      break;
  }

  return success;
}
