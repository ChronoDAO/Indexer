import prisma from "../prismaRequests/prisma";
// ADD Rarities here and run this to add it to the DB.
const rarities = [
  { name: "common" },
  { name: "uncommon" },
  { name: "rare" },
  { name: "epic" },
  { name: "legendary" },
  { name: "mythic" },
  { name: "exalted" },
];

export async function seedRarities() {
  for (const rarity of rarities) {
    try {
      const existingRarity = await prisma.rarity.findUnique({
        where: {
          name: rarity.name,
        },
      });

      if (!existingRarity) {
        await prisma.rarity.create({
          data: rarity,
        });
        console.log(`Added rarity: ${rarity.name}`);
      } else {
        console.log(`Rarity ${rarity.name} already exists, skipping.`);
      }
    } catch (error: any) {
      console.error(`Error adding rarity ${rarity.name}: ${error.message}`);
    }
  }
}


