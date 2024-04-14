import { Injectable } from '@nestjs/common';
import { UsersRepo } from 'src/repositories/repositories.users';

@Injectable()
export class UsersService {
  constructor(private userRepo: UsersRepo) {}

  async findAll() {
    return await this.userRepo.listAll();
  }
}
