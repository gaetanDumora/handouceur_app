import { Inject, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export abstract class Repository {
  // protected prisma: PrismaClient;
  protected readonly DEFAULT_ORDERING: 'desc';
  protected readonly DEFAULT_ORDERING_KEY: 'createdAt';
  constructor(
    protected prismaService: PrismaService,
    @Inject('PRISMA_INSTANCE') protected prismaInstance: PrismaClient,
  ) {}
  protected exclude<T, Key extends keyof T>(obj: T, keys: Key[]) {
    const filteredEntries = Object.entries(
      obj as Record<string, unknown>,
    ).filter(([key]) => !keys.includes(key as Key));
    return Object.fromEntries(filteredEntries) as Omit<T, Key>;
  }

  protected isPrismaError(error: Error) {
    return (
      error instanceof PrismaClientKnownRequestError ||
      error instanceof PrismaClientInitializationError ||
      error instanceof PrismaClientUnknownRequestError
    );
  }

  protected async tryQuery<T>(query: Prisma.PrismaPromise<T>) {
    try {
      const result = await query;
      // Everything is ok, return the result of the query
      return result;
    } catch (error) {
      if (this.isPrismaError(error)) {
        // Something goes wrong this the database connection, we should retry
        // Let refresh the database credentials and instantiate a new PrismaClient
        const newInstance = true;
        this.prismaInstance =
          await this.prismaService.getPrismaInstance(newInstance);
      } else {
        throw error;
      }
    }
  }
}
