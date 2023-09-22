import prisma from "../prismaRequests/prisma";
// This is used by synchronizedata, not standalone.

export async function updateFloorPrice(givenItem: any) {
  try {
    // Find the item with the specified archetypeId

    const prismaItem = await prisma.item.findUnique({
      where: { archetypeId: givenItem.metadata.archetypeId },
    });

    if (!prismaItem) {
      throw new Error(
        `Item with archetypeId ${givenItem.archetypeId} not found.`
      );
    }
    if (prismaItem.floorPrice !== givenItem.minPrice) {
      // Update the floorPrice with the value from givenItem.minPrice
      const updatedItem = await prisma.item.update({
        where: { archetypeId: givenItem.metadata.archetypeId },
        data: {
          floorPrice: givenItem.minPrice,
        },
      });
      console.log(`changed floorPrice of ${updatedItem.archetypeId}`)
    }

    // Return the updated item if needed
    return;
  } catch (error: any) {
    console.error(`Error updating floorPrice: ${error.message}`);
  }
}
