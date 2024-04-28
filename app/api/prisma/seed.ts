import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const main = async () => {
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

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
