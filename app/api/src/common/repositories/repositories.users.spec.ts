import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepo } from './repositories.users';
import { PrismaService } from '../prisma/prisma.service';
import { RepositoriesService } from './repositories.service';
import { PrismaClient } from '@prisma/client';

describe('UsersRepo', () => {
  let usersRepo: UsersRepo;
  const sensitiveFields = { password: '123' };
  const mockUserData = {
    userId: '000',
    firstName: 'foo',
    lastName: 'bar',
    username: 'foobar',
    avatarUrl: 'pic',
  };

  beforeEach(async () => {
    const mockFindMany = {
      findMany: jest.fn().mockResolvedValue([
        {
          ...mockUserData,
          ...sensitiveFields,
        },
      ]),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepo,
        RepositoriesService,
        {
          provide: PrismaService,
          useValue: {
            getPrismaInstance: jest.fn().mockResolvedValue({
              users: mockFindMany,
            }),
          },
        },
        {
          provide: PrismaClient,
          useValue: {
            users: mockFindMany,
          },
        },
      ],
    }).compile();

    usersRepo = module.get<UsersRepo>(UsersRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an object without sensitive fields', async () => {
    const results = await usersRepo.listAll();
    expect(results).toEqual([mockUserData]);
  });
});
