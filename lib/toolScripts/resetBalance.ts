import prisma from '../prismaRequests/prisma'

async function updateBalancesToZero() {
  try {
    const updatedPlayers:any = await prisma.player.updateMany({
      where: {},
      data: {
        balance: 0,
        spent: 0,
        sold: 0,
      },
    });

    console.log(`${updatedPlayers.count} players have been updated.`);
  } catch (error) {
    console.error('Error updating balances:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateBalancesToZero();