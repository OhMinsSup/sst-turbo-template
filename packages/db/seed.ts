import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ROLES = [
  {
    name: "최고 관리자",
    symbol: "ADMIN",
    description: "모든 권한을 가진 최고 관리자",
  },
  {
    name: "유저",
    symbol: "USER",
    description: "일반 유저",
  },
];

async function seed() {
  console.log("🌱 Seeding...");
  console.time(`🌱 Database has been seeded`);

  console.time(`💥 Created Role...`);
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: {
        symbol: role.symbol,
      },
      create: {
        name: role.name,
        symbol: role.symbol,
        description: role.description,
      },
      update: {
        name: role.name,
        symbol: role.symbol,
        description: role.description,
      },
    });
  }
  console.timeEnd(`💥 Created Role...`);

  console.timeEnd(`🌱 Database has been seeded`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
