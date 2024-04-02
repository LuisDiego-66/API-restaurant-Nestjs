import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/ValidRoles.interface';

export const META_ROLES = 'roles';

export const Rol = (...args: ValidRoles[]) => {
  return SetMetadata(META_ROLES, args);
};
