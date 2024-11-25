-- CreateEnum
CREATE TYPE "State" AS ENUM ('PRESENTE', 'AUSENTE', 'TARDE', 'JUSTIFICADO');

-- CreateTable
CREATE TABLE "Attendances" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time_entry" TIMESTAMP(3) NOT NULL,
    "time_departure" TIMESTAMP(3) NOT NULL,
    "state" "State" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attendances_user_id_date_key" ON "Attendances"("user_id", "date");

-- AddForeignKey
ALTER TABLE "Attendances" ADD CONSTRAINT "Attendances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
