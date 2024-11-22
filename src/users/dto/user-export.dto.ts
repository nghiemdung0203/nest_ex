/* eslint-disable prettier/prettier */
import { Expose, Transform } from 'class-transformer';


export class UserDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  avatarUrl: string;

  @Expose()
  @Transform(({ obj }) => {
    const permissions = obj.groups.flatMap((group: any) => group.permissions)
      .map((permission: any) => `id: ${permission.id}, name: ${permission.name}`);

    return permissions.join('\n');
  })
  permissions: string;
}