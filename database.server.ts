import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure to re-use
// the same connection to the database so we don't end up with
// multiple prisma clients in the same process.
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
  }
  prisma = global.__db;
}

export { prisma };

export async function getChargePoints() {
  try {
    const chargePoints = await prisma.chargePoint.findMany();
    return chargePoints;
  } catch (error) {
    console.error("Database error fetching charge points:", error);
    return [];
  }
}

export async function createChargePoint(chargePoint) {
  try {
    const createdChargePoint = await prisma.chargePoint.create({
      data: chargePoint,
    });
    return createdChargePoint;
  } catch (error) {
    console.error("Database error creating charge point:", error);
    return null;
  }
}

export async function updateChargePoint(id: number, chargePoint) {
  try {
    const updatedChargePoint = await prisma.chargePoint.update({
      where: { id: id },
      data: chargePoint,
    });
    return updatedChargePoint;
  } catch (error) {
    console.error("Database error updating charge point:", error);
    return null;
  }
}

export async function deleteChargePoint(id: number) {
  try {
    await prisma.chargePoint.delete({
      where: { id: id },
    });
    return true;
  } catch (error) {
    console.error("Database error deleting charge point:", error);
    return false;
  }
}
