import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { LITS_CLUB_NAME, LITS_CLUB_SHORT_NAME } from "../src/features/clubs/constants";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Missing required environment variable: DATABASE_URL. Check your .env file.");
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  await prisma.club.upsert({
    where: { name: LITS_CLUB_NAME },
    update: { shortName: LITS_CLUB_SHORT_NAME },
    create: { name: LITS_CLUB_NAME, shortName: LITS_CLUB_SHORT_NAME },
  });
  console.log(`Seeded club: ${LITS_CLUB_NAME} (${LITS_CLUB_SHORT_NAME})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
