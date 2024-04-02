import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { User } from './entities/user.entity';
import { Rol } from '../auth/entities/rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Rol])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
