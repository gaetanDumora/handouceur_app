import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { VaultService } from 'src/common/vault/vault.service';
import { VAULT_KV_KEYS } from 'src/common/vault/vault.interface';
import { Request } from 'express';
import { JWTPayloadDecoded } from '../auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  protected secret: string;
  constructor(private readonly vaultService: VaultService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (
        request: Request,
        rawJwtToken: string,
        done: (err: unknown | null, secret: string | null) => void,
      ) => {
        try {
          if (!this.secret) {
            this.secret = await this.vaultService.getKvSecret(
              VAULT_KV_KEYS.JWT_SECRET,
            );
          }
          return done(null, this.secret);
        } catch (error) {
          return done(error, null);
        }
      },
    });
  }

  async validate(payload: JWTPayloadDecoded) {
    return payload;
  }
}
