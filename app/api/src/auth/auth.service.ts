import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { genSalt, hash, compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './auth.interface';
import { UserDTO, UserBaseDTO } from 'src/users/users.dto';

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

  async registerUser(singUpRequestDTO: UserBaseDTO): Promise<UserDTO | null> {
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
  ): Promise<UserDTO | null> {
    const user = await this.usersService.findOne(identifier);
    if (!user?.password) {
      return null;
    }

    const match = await this.verifyPassword(candidatePassword, user.password);
    if (!match) {
      return null;
    }

    delete (user as any).password;
    return user as UserDTO;
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
