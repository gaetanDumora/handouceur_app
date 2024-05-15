import { Expose, Type } from 'class-transformer';
import { UserPermissions, UserRoles } from './users.interface';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
export class UserBaseDTO {
  @Expose() @IsString() @MinLength(5) username: string;
  @Expose() @IsEmail() emailAddress: string;
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  password: string;
}
class UserRolesPermissions {
  @Expose() roles: { roleName: UserRoles };
  @Expose() permissions: { permissionName: UserPermissions };
}

export class UserDTO extends UserBaseDTO {
  userId: number;
  @Expose() firstName: string | null;
  @Expose() lastName: string | null;
  @Expose() avatarUrl: string | null;
  @Expose() address: string | null;
  @Expose() createdAt: Date | null;
  updatedAt: Date | null;

  @Type(() => UserRolesPermissions)
  @Expose()
  userRolesPermissions: UserRolesPermissions[];
}
