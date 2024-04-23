import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepo } from './repositories.users';
import { PrismaService } from '../common/prisma/prisma.service';
import { prismaProviders } from '../common/prisma/prisma.providers';
import { RepositoriesService } from './repositories.service';

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...prismaProviders,
        UsersRepo,
        RepositoriesService,
        {
          provide: PrismaService,
          useValue: {
            getPrismaInstance: jest.fn().mockResolvedValue({
              // Mock the connection result
              users: {
                findMany: jest.fn().mockResolvedValue([
                  {
                    ...mockUserData,
                    ...sensitiveFields,
                  },
                ]),
              },
            }),
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
