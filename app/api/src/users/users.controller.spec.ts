import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let userServiceMock: jest.Mocked<UsersService>; // Partial mock for UsersService

  beforeEach(async () => {
    userServiceMock = {
      findAll: jest.fn(),
      insertOne: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: userServiceMock }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      const users = [
        {
          userId: 1,
          firstName: null,
          lastName: null,
          username: 'John',
          avatarUrl: null,
          emailAddress: '',
          password: '',
          address: null,
          createdAt: null,
          updatedAt: null,
        },
        {
          userId: 2,
          firstName: null,
          lastName: null,
          username: 'Jane',
          avatarUrl: null,
          emailAddress: '',
          password: '',
          address: null,
          createdAt: null,
          updatedAt: null,
        },
      ];
      userServiceMock.findAll?.mockResolvedValue(users);

      const result = await controller.getAll();

      expect(result).toEqual(users);
      expect(userServiceMock.findAll).toHaveBeenCalled();
    });
  });
});
