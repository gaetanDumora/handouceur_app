import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SingInRequestDTO, SingUpRequestDTO } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('sign-in')
  async signIn(@Body(new ValidationPipe()) singInRequestDTO: SingInRequestDTO) {
    const { identifier, candidatePassword } = singInRequestDTO;
    try {
      return await this.authService.validateSignIn(
        identifier,
        candidatePassword,
      );
    } catch (error) {
      throw new NotFoundException();
    }
  }
  @Post('sign-up')
  async signUp(@Body(new ValidationPipe()) singUpRequestDTO: SingUpRequestDTO) {
    const { password, ...user } = singUpRequestDTO;
    try {
      const hashedPassword = await this.authService.hashPassword(password);
      return await this.usersService.insertOne({
        password: hashedPassword,
        ...user,
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
