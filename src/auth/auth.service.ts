import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { PaginationDto } from '../common/dtos/pagination.dto';
import {
  CreateRolDto,
  LoginUserDto,
  UpdateRolDto,
  LoginPinUserDto,
} from './dto';
import { JwtPayload } from './interfaces/jwt_payload.interface';

import { User } from '../users/entities/user.entity';
import { Action } from './entities/action.entity';
import { Rol } from './entities/rol.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,

    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,

    private readonly jwtService: JwtService,
    private readonly dataSourse: DataSource,
  ) {}

  //? Login  ----------------------------------------------------------------------

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  //? Login Pin  ----------------------------------------------------------------------

  async loginPin(loginPinUserDto: LoginPinUserDto) {
    //! hashear el pin y compararlo
    const { pin } = loginPinUserDto;

    const user = await this.userRepository.findOne({
      where: { pin },
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (pin)');

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  //? Create Rol  ----------------------------------------------------------------------

  async create(createRolDto: CreateRolDto) {
    try {
      //! crea las acciones directamente sin el .map Revisar!!
      const newRol = this.rolRepository.create(createRolDto);
      const rolCreated = await this.rolRepository.save(newRol);
      return rolCreated;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //? FindAll Rol  ----------------------------------------------------------------------

  findAll(paginationDto: PaginationDto) {
    const { limit, offset = 0 } = paginationDto;
    const roles = this.rolRepository.find({
      take: limit,
      skip: offset,
      relations: { actions: true },
    });
    return roles;
  }

  //? FindOne Rol  ----------------------------------------------------------------------

  async findOne(id: string) {
    const section = await this.rolRepository.findOne({
      where: { id },
      relations: { actions: true },
    });
    if (!section) throw new NotFoundException('Rol not found');
    return section;
  }

  //? Update Rol  ----------------------------------------------------------------------

  async update(id: string, updateRolDto: UpdateRolDto) {
    const { actions, ...toUpdate } = updateRolDto;

    const newRol = await this.rolRepository.preload({
      id,
      ...toUpdate,
    });
    if (!newRol) return new NotFoundException('Rol not found').getResponse();

    const queryRunner = this.dataSourse.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (actions) {
        await queryRunner.manager.delete(Action, {
          rol: { id: id },
        });

        newRol.actions = actions.map((action) =>
          this.actionRepository.create(action),
        );
      }

      await queryRunner.manager.save(newRol);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      const fullRol = await this.findOne(newRol.id);
      return fullRol;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  //? Remove Rol  ----------------------------------------------------------------------

  remove(id: string) {
    //TODO terminar de hacer
    return `This action removes a #${id} auth`;
  }

  //? Generate JWT  ----------------------------------------------------------------------

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  //* Functions

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected Error, check server Logs',
    );
  }
}
