import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../interfaces/jwt_payload.interface';
import { User } from '../../users/entities/user.entity';
import { Action } from '../entities/action.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      //ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  validate(payload: JwtPayload) {
    const { id } = payload;
    const user = this.userRepository.findOne({
      where: { id },
      relations: { rol: { actions: true } },
    });
    if (!user) throw new UnauthorizedException('Token no valid');

    //? en la Request
    return user;
  }
}
