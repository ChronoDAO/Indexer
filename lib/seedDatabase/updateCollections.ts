import prisma from "../prismaRequests/prisma";
// ADD Collections here and run this to add it to the DB.
const collections = [
  { name: "BT0" },
];

export async function seedCollections() {
  for (const collection of collections) {
    try {
      const existingCollection = await prisma.collection.findUnique({
        where: {
          name: collection.name,
        },
      });

      if (!existingCollection) {
        await prisma.collection.create({
          data: collection,
        });
        console.log(`Added collection: ${collection.name}`);
      } else {
        console.log(`collection ${collection.name} already exists, skipping.`);
      }
    } catch (error: any) {
      console.error(`Error adding collection ${collection.name}: ${error.message}`);
    }
  }
}


