import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  //? Create Order  ----------------------------------------------------------------------

  //! Obtener user de la req e insertar
  //! sumar todos los precios para el precio total
  async create(createOrderDto: CreateOrderDto) {
    try {
      const newOrder = this.orderRepository.create(createOrderDto);
      const orderCreated = await this.orderRepository.save(newOrder);
      return orderCreated;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //? FindAll Order  ----------------------------------------------------------------------

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset = 0 } = paginationDto;
    const orders = await this.orderRepository.find({
      take: limit,
      skip: offset,
      relations: {
        table: true,
        item: { food: { variant: { options: true } } },
        user: true,
        client: true,
      },
      select: {
        //  table: { id: true, number: true },
        //  item: { id: true, amount: true, food: { id: true } },
      },
    });
    return orders;
  }

  //? FindOne Order  ----------------------------------------------------------------------

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        table: true,
        item: { food: { variant: { options: true } } },
        user: true,
        client: true,
      },
      select: {
        table: { id: true, number: true },
        item: { id: true, amount: true, food: { id: true, name: true } },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  //? Update Order  ----------------------------------------------------------------------

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const newOrder = await this.orderRepository.preload({
        id,
        ...updateOrderDto,
      });
      if (!newOrder)
        return new NotFoundException('Order not found').getResponse();
      const orderUpdated = await this.orderRepository.save(newOrder);
      return orderUpdated;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //? Remove Order  ----------------------------------------------------------------------

  async remove(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (!order) throw new NotFoundException('Order not found');

    const orderDeleted = await this.orderRepository.softRemove(order);
    return { ...orderDeleted, eliminated: true };
  }

  //TODO:
  //? Get Orders for Waiters
  getOrdersForWaiters() {}

  //* Functions

  private handleDBExceptions(error: any) {
    if (error.sqlState === '23000')
      throw new BadRequestException(error.sqlMessage); //! llave duplicada
    throw new InternalServerErrorException(
      'Unexpected Error, check server Logs',
    );
  }
}
