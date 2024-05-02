import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { Request as Req } from 'express';
import { Public } from './guards/public.decorator';
import { UserBaseDTO } from 'src/users/users.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Request() req: Req) {
    return this.authService.login(req?.user);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body(new ValidationPipe()) singUpRequestDTO: UserBaseDTO) {
    return this.authService.registerUser(singUpRequestDTO);
  }
}
