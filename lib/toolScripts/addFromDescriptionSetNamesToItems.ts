import prisma from "../prismaRequests/prisma";

export default async function addFromDescriptionSetNamesToItems() {
  try {
    const items = await prisma.item.findMany({});
    const sets = await prisma.set.findMany({});
    
    for (const item of items) {
      for (const set of sets) {
        // Check if the set name is present in the item's description
        if (item.description && (item.description.includes(set.name)||item.name.includes(set.name))) {
          // Associate the item with the set (if not already associated)
          const isAlreadyAssociated = (item.setName === set.name);
          
          if (!isAlreadyAssociated) {
            await prisma.item.update({
              where: {
                name: item.name,
              },
              data: {
                setName:  set.name,
              },
            });
            console.log(`Item '${item.name}' associated with set '${set.name}'`);
          }
        }
      }
    }
    
    console.log("Set names added to items based on descriptions.");
  } catch (error) {
    console.error('Error adding set names to items:', error);
  }
}
addFromDescriptionSetNamesToItems();
