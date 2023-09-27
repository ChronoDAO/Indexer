import prisma from "../prismaRequests/prisma";
import fs from "fs";

export default async function addSetNamesToItems() {
  const csvData = fs.readFileSync("/home/lionel/dossierlinux/chronodao/Indexer/lib/toolScripts/liteItemForsetName.csv", "utf-8");

  // Split the CSV data into lines
  const lines = csvData.split("\n");

  // Process each line and update the set name for items
  for (const line of lines) {
    const columns = line.split(",");

    if (columns.length >= 7) {
      const setName = columns[6].trim(); // Assuming set name is in the 7th column
      console.log(setName)
      const itemName = columns[1].trim(); // Assuming item name is in the 1st column
      console.log(itemName)
      // Find the item by name and update the set name
      const item = await prisma.item.findFirst({
        where: {
          name: itemName,
        },
      });
      const set = await prisma.set.findFirst({
        where:{
          name:setName,
        }
      })
      
      if (item&&set) {
        console.log("item and set found")
        await prisma.item.update({
          where: {
            name: itemName,
          },
          data: {
            setName: setName,
          },
        });
      }
    }
  }

  console.log("Set names updated based on CSV data.");
}
addSetNamesToItems();
