import { UseGuards, applyDecorators } from '@nestjs/common';

import { ValidRoles } from '../interfaces/ValidRoles.interface';
import { Rol } from './roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    Rol(...roles),
    UseGuards(AuthGuard(/* 'jwt' */), RolesGuard),
  );
}
