-- CreateTable
CREATE TABLE "votes" (
    "id" SERIAL NOT NULL,
    "session_id" TEXT NOT NULL,
    "poll_option_id" TEXT NOT NULL,
    "poll_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "votes_session_id_poll_id_key" ON "votes"("session_id", "poll_id");

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_poll_option_id_fkey" FOREIGN KEY ("poll_option_id") REFERENCES "poll_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "polls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
