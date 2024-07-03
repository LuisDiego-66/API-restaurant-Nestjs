import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/ValidRoles.interface';
import { ValidActions } from '../enums/valid-actions.enum';

export const META_ROLES = 'roles';

export const Rol = (...args: ValidActions[] /* ValidRoles[] */) => {
  return SetMetadata(META_ROLES, args);
};
