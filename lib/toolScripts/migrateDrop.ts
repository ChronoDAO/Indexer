const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function migrateData() {
  try {
    let drops = await prisma.drop.findMany({
      where: {
        composedId: null,
      },
      
    });
    
    let l = drops.length
    let i =0;
    for (i = 0; i < drops.length; i++) {
      // Retrieve the associated NFT record based on the nftId
      let drop = drops[i]
      console.log(drop.composedId)
      const nft = await prisma.NFT.findFirst({
        where: {
          id: drop.nftId,
        },
      });
      
        // Update the composedId field in the Drop record
        const newdrop = await prisma.drop.update({
          where: {
            id: drop.id,
          },
          data: {
            composedId: nft.composedId,
          },
        });
      console.log(`${i}/${l}nftid : ${drop.nftId}  new compid: ${newdrop.composedId}`);
    }

    console.log("Data migration completed successfully.");
  } catch (error) {
    console.error("Error performing data migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();
