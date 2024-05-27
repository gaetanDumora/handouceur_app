import { PrismaClient } from '@prisma/client';
// Will use DATABASE_URL from .env when starting the app. It will be then overwritten by the vault agent
const prisma = new PrismaClient();

const seed = async () => {
  return await Promise.all([
    prisma.roles.createMany({
      data: [
        { roleName: 'owner', roleId: 1 },
        { roleName: 'admin', roleId: 2 },
        { roleName: 'user', roleId: 3 },
      ],
    }),
    prisma.permissions.createMany({
      data: [
        { permissionName: 'rwd', permissionId: 1 },
        { permissionName: 'rw', permissionId: 2 },
        { permissionName: 'ro', permissionId: 3 },
      ],
    }),
  ]);
};

(async function main() {
  try {
    await seed();
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
})();
