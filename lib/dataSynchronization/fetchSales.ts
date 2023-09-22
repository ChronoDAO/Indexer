import fetchRetry from "fetch-retry"; //important do not delete
const fetch = require("fetch-retry")(global.fetch);

export default async function fetchSales(archetypeId: string, page: number) {
  const pageMaxSize = 1000;
  let olItem: any;
  let olItemHistoryResponse = await fetch(
    `https://openloot.com/api/v2/market/items/transaction/history?archetypeId=${archetypeId}&page=${page}&pageSize=${pageMaxSize}`,
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
            olItem = await response.json();

            // Check if the JSON is both valid and non-empty
            if (olItem !== null && Object.keys(olItem).length > 0) {
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
      retryDelay: function (attempt: any, error: any, response: any) {
        let retryIn = response.headers.get("Retry-After");
        let nextIntent;
        if (retryIn) {
          retryIn = parseInt(retryIn);
          nextIntent = retryIn * 1000;
        } else if (attempt < 2) {
          nextIntent = 1000;
        } else if (attempt < 6) {
          nextIntent = 30 * 1000;
        } else {
          nextIntent = Math.pow(2, attempt) * 1000;
        } // 1000, 2000, 4000
        console.log(`${archetypeId} retry in ${nextIntent / 1000} seconds`);
        return nextIntent;
      },
    }
  );
  return olItem;
}
