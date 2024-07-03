import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

//! la data es lo que recibe el decorador
export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest(); // obtenemos la req
    const user: User = req.user;

    if (!data) {
      //! si se quiere obtener el usuario sin haber pasado por el auth-guard
      if (!user)
        throw new InternalServerErrorException('User not found (request)');
      return user;
    }
    return user;
  },
);
