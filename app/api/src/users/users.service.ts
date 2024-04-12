import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  private allowedErrors(error: any) {
    return (
      error?.code === 'P1000' ||
      error?.name === 'PrismaClientInitializationError'
    );
  }

  async findAll(newInstance?: boolean) {
    try {
      const prisma = await this.prismaService.getPrismaInstance(newInstance);
      return await prisma.users.findMany();
    } catch (error) {
      if (!this.allowedErrors(error)) {
        throw error;
      }
      this.findAll(true);
    }
  }
}
