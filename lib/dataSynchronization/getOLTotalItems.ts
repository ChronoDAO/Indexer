import fetchRetry from "fetch-retry"; //important do not delete
// fetch-retry can also wrap Node.js's native fetch API implementation:
const fetch = require("fetch-retry")(global.fetch);

export async function getOLTotalItems() {
  let page = 1;
  let pageSize = 1;
  let olItemsList:any;
  let olListingItems = await fetch(
    `https://openloot.com/api/v2/market/listings?gameId=56a149cf-f146-487a-8a1c-58dc9ff3a15c&page=${page}&pageSize=${pageSize}`,
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
            olItemsList = await response.json();
      
            // Check if the JSON is both valid and non-empty
            if (olItemsList !== null && Object.keys(olItemsList).length > 0) {
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
        let nextIntent;
        if (attempt < 6) nextIntent = 30 * 1000;
        else nextIntent = Math.pow(2, attempt) * 1000; // 1000, 2000, 4000
        console.log(`retry in ${nextIntent / 1000} second`);
        return nextIntent;
      },
    }
  );


  

  return olItemsList.totalItems;
}



