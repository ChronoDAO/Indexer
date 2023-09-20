import prisma from "../prismaRequests/prisma";

export async function addSaleToPrisma(newSale: any) {
  try {
    let sale;
    if (newSale.price == null) newSale.price = 0;
    try {
       sale = await prisma.sale.create({
        data: {
          transactionId: `[${newSale.issuedId}]${newSale.archetypeId}-${newSale.date}`,
          price: newSale.price,
          date: new Date(newSale.date),
          from: {
            connectOrCreate: {
              where: {
                name: newSale.fromUser,
              },
              create: {
                name: newSale.fromUser,
                sold: newSale.price,
              },
            },
          },
          to: {
            connectOrCreate: {
              where: {
                name: newSale.toUser,
              },
              create: {
                name: newSale.toUser,
              },
            },
          },
          nft: {
            connectOrCreate: {
              where: {
                composedId: `[${newSale.issuedId}]${newSale.archetypeId}`,
              },
              create: {
                composedId: `[${newSale.issuedId}]${newSale.archetypeId}`,
                issuedId: newSale.issuedId,
                item: {
                  connect: {
                    archetypeId: newSale.archetypeId,
                  },
                },
              },
            },
          },
        },
      });
    } catch (error: any) {
      console.log(
        `error in addSaleToPrisma with [${newSale.issuedId}]${newSale.archetypeId}-${newSale.date} : ${error}`
      );
      return false ; // Bypass update to Players and nfts since sale failed
    }
    let fromPlayer = await prisma.player.update({
      where: {
        name: sale.fromPlayer,
      },
      data: {
        balance: { increment: sale.price },
        sold: { increment: sale.price },
      },
    });
    let toPlayer = await prisma.player.update({
      where: { name: sale.toPlayer },
      data: {
        balance: { decrement: sale.price },
        spent: { increment: sale.price },
      },
    });
    let correspondingNft = await prisma.nFT.update({
      where: { composedId: sale.nftId },
      data: {
        ownerName: sale.toPlayer,
      },
    });
    let correspondingItem = await prisma.item.update({
      where: { archetypeId: newSale.archetypeId },
      data: {
        totalTransfers: { increment: 1 },

      },
    });
  } catch (error: any) {
    console.log(
      `error in addSaleToPrisma with [${newSale.issuedId}]${newSale.archetypeId} while updating player/nft/totalTransfers : ${error}`
    );
    return false;
  }
  
  return true;
}
