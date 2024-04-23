import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class SingInRequestDTO {
  @IsString()
  identifier: string;
  @IsString()
  candidatePassword: string;
}

export class SingUpRequestDTO {
  @IsString()
  username: string;
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 0,
  })
  password: string;
  @IsEmail()
  emailAddress: string;
}
