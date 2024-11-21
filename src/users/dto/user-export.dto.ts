/* eslint-disable prettier/prettier */
import { Expose, Transform } from 'class-transformer';

class PermissionDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}



export class UserDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  avatarUrl: string;

  @Expose()
  @Transform(({ obj }) =>
    obj.groups.flatMap((group: any) => group.permissions).map((permission: any) => ({
      id: permission.id,
      name: permission.name,
    })),
  )
  permissions: PermissionDto[];
}
