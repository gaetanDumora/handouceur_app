import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { genSalt, hash, compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.interface';
import { SingUpRequestDTO } from './auth.dto';
import { JWTPayload } from './auth.interface';
// import { JWTPayload } from './auth.interface';

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

  async registerUser(singUpRequestDTO: SingUpRequestDTO): Promise<User | null> {
    const { password, ...user } = singUpRequestDTO;
    try {
      const hashedPassword = await this.hashPassword(password);
      return await this.usersService.insertOne({
        password: hashedPassword,
        ...user,
      });
    } catch (error) {
      throw new UnprocessableEntityException({ error });
    }
  }

  async validateUser(
    identifier: string,
    candidatePassword: string,
  ): Promise<User | null> {
    const user = await this.usersService.findOne(identifier);
    if (!user) {
      return null;
    }

    const match = await this.verifyPassword(candidatePassword, user.password);
    if (!match) {
      return null;
    }

    delete (user as any).password;
    return user;
  }

  async login(payload: JWTPayload | undefined) {
    if (!payload) {
      throw new UnauthorizedException();
    }

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
