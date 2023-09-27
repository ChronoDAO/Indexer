import prisma from "../prismaRequests/prisma";

export async function addItemToPrisma(item: any) {
  try {
    const data = {
      archetypeId: item.metadata.archetypeId,
      name: item.metadata.name,
      description: item.metadata.description || null,
      imageUrl: item.metadata.imageUrl || null,
      floorPrice: item.minPrice || null,
      maxIssuance: item.metadata.maxIssuance,
      optionName: item.metadata.optionName,
      rarity: {
        connect: {
          name: item.metadata.rarity,
        },
      },
      collection: {
        connect: {
          name: item.metadata.collection,
        },
      },
      totalTransfers: 0,
      synced: false
    };

    const tags = item.metadata.tags || [];

    // Create an array to store the created or to be connected tags
    const tagConnections: { name: string }[] = [];

    // Loop through the tags
    for (const tag of tags) {
      // Try to find an existing tag with the same name
      const existingTag = await prisma.tag.findUnique({
        where: {
          name: tag,
        },
      });
      
      // If the tag exists, connect to it
      if (existingTag) {
        tagConnections.push({ name: existingTag.name });
      } else {
        // If the tag doesn't exist, create it and connect to it
        const createdTag = await prisma.tag.create({
          data: {
            name: tag,
          },
        });
        tagConnections.push({
          name: createdTag.name,
        });
      }
    }

    const newItem = await prisma.item.create({ data });

    // After item creation, connect the tags to the newItem
    await prisma.item.update({
      where: {
        archetypeId: newItem.archetypeId, // Use the appropriate identifier here
      },
      data: {
        tags: {
          connect: tagConnections,
        },
      },
    });

    console.log(`Item added to Prisma: ${newItem.name}`);
    
  } catch (error: any) {
    console.error(
      `Error adding ${item.metadata.name} to Prisma: ${error.message}`
    );
  }
}
