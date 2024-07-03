import { UseGuards, applyDecorators } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { Rol } from './roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { ValidActions } from '../enums/valid-actions.enum';

export function Auth(...actions: ValidActions[] /* ValidRoles[] */) {
  return applyDecorators(
    Rol(...actions),
    UseGuards(AuthGuard(/* 'jwt' */), RolesGuard),
  );
}
