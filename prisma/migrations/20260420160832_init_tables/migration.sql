-- CreateTable
CREATE TABLE "StrankaObsah" (
    "id" SERIAL NOT NULL,
    "stranka" TEXT NOT NULL,
    "sekcia" TEXT NOT NULL,
    "obsah" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StrankaObsah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produkt" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mainImage" TEXT NOT NULL,
    "gallery" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produkt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Objednavka" (
    "id" SERIAL NOT NULL,
    "meno" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "email" TEXT,
    "sprava" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Nové',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Objednavka_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StrankaObsah_sekcia_key" ON "StrankaObsah"("sekcia");
