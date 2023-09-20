import prisma from '../prismaRequests/prisma'

export default async function CountDrop(){
  let drops = await prisma.drop.findMany({
    where: {
      composedId: null,
    },
    
  });
  let dropcount = await prisma.drop.count({
    where: {
      composedId: null,
    },
})
  console.log(dropcount)
  console.log(drops.length)
  return ;
}
CountDrop();