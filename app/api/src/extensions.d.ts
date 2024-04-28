import { JWTPayload } from './auth/auth.interface';

// to make the file a module and avoid the TypeScript error
export {};

declare module 'express' {
  export interface Request {
    user?: JWTPayload;
  }
}
