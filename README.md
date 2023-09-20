This is a script to update our DB based on the Public API Big Time has put at our disposal.

Run script.ts to start


To initialize a new DB you need to :

Run npx ts-node lib/seedDatabase/seed.ts

Our three legacy Tables for Players, NFTs, Drops.
Import them through pgAdmin in that order with these fields : 
1_ Player : name, spent, sold, balance 
2_ NFT : composedId, issuedId, ownerName, archetypeId 
3_ Drop : date, toPlayer, ComposedId

Run the script.ts to start updating your data straight from the OL API. ( since you seed from 0 expect several days of runtime to update the whole history)


Other scripts:

Allows to Update just one specific item's sales : 
npx ts-node lib/dataSynchronization/refreshSpecificItemSales.ts BT0_Blast_2H_Hammer

To build js from ts if needed ? (runs tsc) 
npm run build

To run the app : (runs node script.js)
