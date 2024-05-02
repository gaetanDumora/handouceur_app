import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepo } from '../common/repo/repo.users';
import { prismaProviders } from '../common/prisma/prisma.providers';
import { PrismaService } from '../common/prisma/prisma.service';
import { VaultService } from '../common/vault/vault.service';
import { ConfigService } from '@nestjs/config';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersRepo,
        PrismaService,
        ConfigService,
        ...prismaProviders,
        { provide: VaultService, useValue: jest.fn() },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
