import { Provider } from '@nestjs/common';
import { PrismaService } from './prisma.service';

export const prismaProviders: Provider[] = [
  {
    provide: 'PRISMA_INSTANCE',
    inject: [PrismaService],
    useFactory: async (prismaService: PrismaService) => {
      let prismaInstance;
      try {
        prismaInstance = await prismaService.getPrismaInstance();
        return prismaInstance;
      } catch (error) {
        prismaInstance?.$disconnect();
        console.log('[prisma] disconnect PrismaClient', { error });
      }
    },
  },
];
