import { Inject, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class RepositoriesService {
  // protected prisma: PrismaClient;
  public readonly DEFAULT_ORDERING: 'desc';
  public readonly DEFAULT_ORDERING_KEY: 'createdAt';
  private RETRY = 5;
  constructor(
    protected prismaService: PrismaService,
    @Inject('PRISMA_INSTANCE') public prisma: PrismaClient,
  ) {}
  public exclude<T, Key extends keyof T>(obj: T, keys: Key[]) {
    const filteredEntries = Object.entries(
      obj as Record<string, unknown>,
    ).filter(([key]) => !keys.includes(key as Key));
    return Object.fromEntries(filteredEntries) as Omit<T, Key>;
  }

  private isPrismaError(error: Error) {
    return (
      error instanceof PrismaClientKnownRequestError ||
      error instanceof PrismaClientInitializationError ||
      error instanceof PrismaClientUnknownRequestError
    );
  }

  public async runQuery<T>(query: Prisma.PrismaPromise<T>) {
    try {
      const data = await query;
      // Everything is ok, return the result of the query
      return { data, retry: false };
    } catch (error) {
      if (this.isPrismaError(error) && this.RETRY > 0) {
        // Something goes wrong this the database connection, we should retry
        this.RETRY--;
        // Let refresh the database credentials and instantiate a new PrismaClient
        this.prisma = await this.prismaService.getPrismaInstance(true);
        return { data: null, retry: true };
      } else {
        throw error;
      }
    }
  }
}
