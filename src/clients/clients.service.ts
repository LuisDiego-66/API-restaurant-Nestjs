import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateClientDto, UpdateClientDto } from './dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  //? Create Client  ----------------------------------------------------------------------
  async create(createClientDto: CreateClientDto) {
    try {
      const newClient = this.clientRepository.create(createClientDto);
      const clientCreated = await this.clientRepository.save(newClient);
      return clientCreated;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //? FindAll Clients  ----------------------------------------------------------------------
  findAll(paginationDto: PaginationDto) {
    const { limit, offset = 0 } = paginationDto;
    const clients = this.clientRepository.find({
      take: limit,
      skip: offset,
    });
    return clients;
  }

  //? FindOne Option  ----------------------------------------------------------------------
  async findOne(id: string) {
    const client = await this.clientRepository.findOneBy({ id }); //! puede modificarse a findOne
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  //? Update Client  ----------------------------------------------------------------------
  async update(id: string, updateClientDto: UpdateClientDto) {
    try {
      const newClient = await this.clientRepository.preload({
        id,
        ...updateClientDto,
      });
      if (!newClient)
        return new NotFoundException('Client not found').getResponse();
      const clientUpdated = await this.clientRepository.save(newClient);
      return clientUpdated;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //? Remove Client  ----------------------------------------------------------------------
  async remove(id: string) {
    const client = await this.clientRepository.findOne({
      where: { id },
    });
    if (!client) throw new NotFoundException('Client not found');

    const clientDeleted = await this.clientRepository.softRemove(client);
    return { ...clientDeleted, eliminated: true };
  }

  //* Functions
  private handleDBExceptions(error: any) {
    if (error.sqlState === '23000')
      throw new BadRequestException(error.sqlMessage); //! error de "no existe el ci repetido"
    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected Error, check server Logs',
    );
  }
}
