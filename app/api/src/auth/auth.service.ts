import { Injectable } from '@nestjs/common';
import { genSalt, hash, compare } from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;
  constructor(private usersService: UsersService) {}
  async verifyPassword(candidatePassword: string, storedHashPassword: string) {
    try {
      return await compare(candidatePassword, storedHashPassword);
    } catch (error) {
      throw new Error('Failed to verify password');
    }
  }
  async hashPassword(password: string) {
    try {
      const salt = await genSalt(this.saltRounds);
      const hashedPassword = await hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw new Error('Failed to hash password');
    }
  }

  async validateSignIn(identifier: string, candidatePassword: string) {
    const user = await this.usersService.findOnePrivate(identifier);
    if (!user) {
      return false;
    }

    return await this.verifyPassword(candidatePassword, user.password);
  }
}
