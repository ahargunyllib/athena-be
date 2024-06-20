-- CreateTable
CREATE TABLE "posts" (
    "postId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("postId")
);

-- CreateTable
CREATE TABLE "public_informations" (
    "publicInformationId" TEXT NOT NULL,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "authorId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "public_informations_pkey" PRIMARY KEY ("publicInformationId")
);

-- CreateTable
CREATE TABLE "reports" (
    "reportId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "publicInformationId" TEXT NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("reportId")
);

-- CreateIndex
CREATE UNIQUE INDEX "public_informations_postId_key" ON "public_informations"("postId");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public_informations" ADD CONSTRAINT "public_informations_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public_informations" ADD CONSTRAINT "public_informations_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("postId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_publicInformationId_fkey" FOREIGN KEY ("publicInformationId") REFERENCES "public_informations"("publicInformationId") ON DELETE RESTRICT ON UPDATE CASCADE;
