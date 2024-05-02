import { Injectable } from '@nestjs/common';
import { UsersRepo } from '../common/repo/repo.users';
import { UserBaseDTO } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private userRepo: UsersRepo) {}

  async findAll() {
    return await this.userRepo.listAll();
  }

  async findOne(identifier: string | number) {
    return await this.userRepo.findOne(identifier);
  }

  async insertOne(user: UserBaseDTO) {
    return await this.userRepo.create(user);
  }
}
