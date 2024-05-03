import { remember } from "@epic-web/remember";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = remember("prisma", getClient);

function getClient() {
  // NOTE: during development if you change anything in this function, remember
  // that this only runs once per server restart and won't automatically be
  // re-run per request like everything else is.
  const client = new PrismaClient().$extends(withAccelerate());

  void client.$connect();

  return client;
}

export { prisma };
