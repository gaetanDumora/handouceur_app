import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { genSalt, hash, compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload, AuthResponse } from './auth.interface';
import { UserBaseDTO } from 'src/users/users.dto';
import {
  PRISMA_ERRORS,
  PrismaCodeErrors,
  UNIQ_CONSTRAINT,
  INCORRECT_CREDENTIALS,
} from 'src/common/prisma/prisma.interface';

@Injectable()
export class AuthService {
  private readonly SALT_ROUND = 10;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  private async verifyPassword(
    candidatePassword: string,
    storedHashPassword: string,
  ) {
    try {
      return await compare(candidatePassword, storedHashPassword);
    } catch (error) {
      throw new Error('Failed to compare password');
    }
  }
  private async hashPassword(password: string) {
    try {
      const salt = await genSalt(this.SALT_ROUND);
      const hashedPassword = await hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw new UnprocessableEntityException({ error });
    }
  }

  async registerUser(singUpRequestDTO: UserBaseDTO): Promise<AuthResponse> {
    const { password, ...user } = singUpRequestDTO;
    try {
      const hashedPassword = await this.hashPassword(password);
      await this.usersService.insertOne({
        password: hashedPassword,
        ...user,
      });
      return { success: true };
    } catch (error) {
      if (PRISMA_ERRORS[error?.code as PrismaCodeErrors] === UNIQ_CONSTRAINT) {
        const regExp = /\(\`([^)]+)\`\)/;
        const matches = regExp.exec(error.message);
        return {
          success: false,
          ...(matches
            ? { reason: { code: UNIQ_CONSTRAINT, description: matches[1] } }
            : undefined),
        };
      } else {
        throw new UnprocessableEntityException({ error });
      }
    }
  }

  async validateUser(
    identifier: string,
    candidatePassword: string,
  ): Promise<AuthResponse> {
    const user = await this.usersService.findOne(identifier);

    if (!user) {
      return {
        success: false,
        reason: { code: INCORRECT_CREDENTIALS, description: 'identifier' },
      };
    }

    const match = await this.verifyPassword(candidatePassword, user.password);
    if (!match) {
      return {
        success: false,
        reason: { code: INCORRECT_CREDENTIALS, description: 'password' },
      };
    }

    delete (user as any).password;
    return { success: true, user };
  }

  async login(payload: JWTPayload) {
    const { success, reason, username, acl } = payload;
    if (!success) {
      return { success, reason };
    }

    return {
      success,
      data: { username, accessToken: this.jwtService.sign(payload), acl },
    };
  }
}
