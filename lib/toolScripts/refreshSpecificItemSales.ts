import prisma from "../prismaRequests/prisma";
import refreshSalesTable from "../dataSynchronization/refreshSalesTable"


export async function refreshItemSales() {
// Get the argument provided after the script name
const archetypeId = process.argv[2];

// Check if the argument is provided
if (!archetypeId) {
  console.error('You need to give an archetypeId at the end of your code.');
  process.exit(1); // Exit with an error code
}
const item = await prisma.item.findFirst({
  where: {archetypeId: archetypeId}
})
if (!item) {
  console.error(`The item associated to your archetypeId : ${archetypeId} can't be found`);
  process.exit(1); // Exit with an error code
}
// Now, you can use the `archetypeId` variable in your function
await refreshSalesTable(archetypeId);
}
refreshItemSales();