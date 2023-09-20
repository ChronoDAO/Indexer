-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "spent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sold" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NFT" (
    "id" SERIAL NOT NULL,
    "composedId" TEXT NOT NULL,
    "issuedId" INTEGER NOT NULL,
    "ownerName" TEXT,
    "archetypeId" TEXT,

    CONSTRAINT "NFT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "archetypeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "floorPrice" DOUBLE PRECISION,
    "maxIssuance" INTEGER NOT NULL,
    "rarityName" TEXT,
    "collectionName" TEXT,
    "optionName" TEXT NOT NULL,
    "totalTransfers" INTEGER NOT NULL,
    "lastApiPull" TIMESTAMP(3),
    "lastSync" TIMESTAMP(3),
    "synced" BOOLEAN NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("archetypeId")
);

-- CreateTable
CREATE TABLE "Tag" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Rarity" (
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Collection" (
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" SERIAL NOT NULL,
    "transactionId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "fromPlayer" TEXT NOT NULL,
    "toPlayer" TEXT NOT NULL,
    "nftId" TEXT NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drop" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "toPlayer" TEXT NOT NULL,
    "composedId" TEXT,

    CONSTRAINT "Drop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ItemToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_name_key" ON "Player"("name");

-- CreateIndex
CREATE UNIQUE INDEX "NFT_composedId_key" ON "NFT"("composedId");

-- CreateIndex
CREATE UNIQUE INDEX "Item_archetypeId_key" ON "Item"("archetypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Item_name_key" ON "Item"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Rarity_name_key" ON "Rarity"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_name_key" ON "Collection"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Sale_transactionId_key" ON "Sale"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemToTag_AB_unique" ON "_ItemToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemToTag_B_index" ON "_ItemToTag"("B");

-- AddForeignKey
ALTER TABLE "NFT" ADD CONSTRAINT "NFT_ownerName_fkey" FOREIGN KEY ("ownerName") REFERENCES "Player"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFT" ADD CONSTRAINT "NFT_archetypeId_fkey" FOREIGN KEY ("archetypeId") REFERENCES "Item"("archetypeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_rarityName_fkey" FOREIGN KEY ("rarityName") REFERENCES "Rarity"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_collectionName_fkey" FOREIGN KEY ("collectionName") REFERENCES "Collection"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_fromPlayer_fkey" FOREIGN KEY ("fromPlayer") REFERENCES "Player"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_toPlayer_fkey" FOREIGN KEY ("toPlayer") REFERENCES "Player"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "NFT"("composedId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drop" ADD CONSTRAINT "Drop_toPlayer_fkey" FOREIGN KEY ("toPlayer") REFERENCES "Player"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drop" ADD CONSTRAINT "Drop_composedId_fkey" FOREIGN KEY ("composedId") REFERENCES "NFT"("composedId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToTag" ADD CONSTRAINT "_ItemToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("archetypeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToTag" ADD CONSTRAINT "_ItemToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("name") ON DELETE CASCADE ON UPDATE CASCADE;
