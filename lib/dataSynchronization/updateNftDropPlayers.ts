import prisma from '../prismaRequests/prisma'

async function updateNFTOwners() {
  const nfts = await prisma.nFT.findMany({
    where:{
      ownerName: null,
      drops: {
        some: {}
      },
    },
    include: {
      drops: {
        select: {
          date: true,
          to: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          date: 'desc', // Order drops by date in descending order to get the most recent one.
        },
        take: 1, // Only get the most recent drop.
      },
    },
  });
  let i = 1;
  for (const nft of nfts) {
    if (nft.drops.length > 0 && nft.drops[0].to.name) {
      const playerName = nft.drops[0].to.name;
      await prisma.nFT.update({
        where: {
          id: nft.id,
        },
        data: {
          ownerName: playerName,
        },
      });

      console.log(`Updated ownerName for NFT ${i} / ${nfts.length} `);
      i++;
    }
  }
}

updateNFTOwners()
  .catch((error) => {
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });