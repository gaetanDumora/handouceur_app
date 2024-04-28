import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UsersRepo } from '../repositories/repositories.users';
import { RepositoriesService } from '../repositories/repositories.service';
import { VaultService } from 'src/common/vault/vault.service';
import { VAULT_KV_KEYS } from 'src/common/vault/vault.interface';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [VaultService],
      useFactory: async (vaultService: VaultService) => ({
        secret: await vaultService.getKvSecret(VAULT_KV_KEYS.JWT_SECRET),
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    UsersRepo,
    RepositoriesService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
