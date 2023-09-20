import prisma from "../prismaRequests/prisma";

export async function getPrismaTotalItems() {
  const totalItemsCount = await prisma.item.count();
  return totalItemsCount;
}

export async function getPrismaItemsList() {
  const archetypeIds = await prisma.item.findMany({
    select: {
      archetypeId: true,
    },
  });
  const archetypeIdList = archetypeIds.map((item) => item.archetypeId);

  return archetypeIdList;
}

