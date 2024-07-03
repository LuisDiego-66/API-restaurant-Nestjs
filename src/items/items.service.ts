import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, DataSource, QueryRunner, In } from 'typeorm';

import { CreateItemDto, UpdateItemDto } from './dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

import { SelectedVariants } from './entities/selected-variants.entity';
import { Variant } from '../variants/entities/variant.entity';
import { Order } from '../orders/entities/order.entity';
import { Item } from './entities/item.entity';

import { FoodsService } from '../foods/foods.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,

    @InjectRepository(SelectedVariants)
    private readonly selectedVariantRepository: Repository<SelectedVariants>,

    private readonly foodService: FoodsService,

    private readonly dataSourse: DataSource,
  ) {}

  //? Create Item  ----------------------------------------------------------------------

  async create(createItemDto: CreateItemDto) {
    let { selectedVariants, food, ...itemDetails } = createItemDto;

    const queryRunner = this.dataSourse.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newItem = this.itemRepository.create({
        food,
        ...itemDetails,
      });

      if (selectedVariants) {
        newItem.selectedVariants =
          this.createSelectedVariants(selectedVariants);

        newItem.priceVariants =
          await this.calculateVariantsSelectedPrice(selectedVariants);
      }

      const priceFood = await this.foodService.findOne(food.id);
      newItem.priceFood = priceFood.price;

      const itemCreated = await queryRunner.manager.save(newItem);
      this.addPriceInOrder(itemCreated.order, itemCreated.subtotal);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return itemCreated;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  //? FindAll Items  ----------------------------------------------------------------------

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset = 0 } = paginationDto;
    const items = await this.itemRepository.find({
      take: limit,
      skip: offset,
      relations: {
        food: true,
        selectedVariants: { variant: { options: true } },
        order: true,
      },
      select: {
        selectedVariants: { id: true, variant: { id: true, name: true } },
      },
    });
    return items;
  }

  //? FindOne Item  ----------------------------------------------------------------------

  async findOne(id: string) {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: {
        food: true,
        selectedVariants: { variant: { options: true } },
        order: true,
      },
      select: {
        selectedVariants: { id: true, variant: { id: true, name: true } },
      },
    });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  //? Update Item  ----------------------------------------------------------------------

  async update(id: string, updateItemDto: UpdateItemDto) {
    const { selectedVariants, ...toUpdate } = updateItemDto;

    let newItem = await this.itemRepository.preload({
      id,
      ...toUpdate,
    });

    if (!newItem) return new NotFoundException('Item not found').getResponse();
    const oldItem = await this.findOne(id);

    const queryRunner = this.dataSourse.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (selectedVariants) {
        this.deletedSelectedVariants(id, queryRunner);
        newItem.selectedVariants =
          this.createSelectedVariants(selectedVariants);
        newItem.priceVariants =
          await this.calculateVariantsSelectedPrice(selectedVariants);
      }

      await queryRunner.manager.save(newItem);
      await this.subtractPriceInOrder(oldItem.order, oldItem.subtotal);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      const fullItem = await this.findOne(newItem.id);

      await this.addPriceInOrder(fullItem.order, fullItem.subtotal);

      return fullItem;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  //? Remove Item  ----------------------------------------------------------------------

  async remove(id: string) {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: { selectedVariants: true, order: true },
    });
    if (!item) throw new NotFoundException('Item not found');

    await this.subtractPriceInOrder(item.order, item.subtotal);
    const itemDeleted = await this.itemRepository.remove(item);
    return { ...itemDeleted, eliminated: true };
  }

  //* Functions

  private createSelectedVariants(
    selectedVariants: Variant[],
  ): SelectedVariants[] {
    return selectedVariants.map((variant) =>
      this.selectedVariantRepository.create({ variant }),
    );
  }

  private async deletedSelectedVariants(id: string, queryRunner: QueryRunner) {
    await queryRunner.manager.delete(SelectedVariants, {
      item: { id },
    });
  }

  private async calculateVariantsSelectedPrice(
    variantsSelected: Variant[],
  ): Promise<number> {
    let subtotal = 0;

    const variants = await this.variantRepository.find({
      where: { id: In(variantsSelected) },
      relations: ['options'],
    });

    for (const variant of variants) {
      for (const option of variant.options) {
        subtotal += option.price;
      }
    }
    return subtotal;
  }

  private async addPriceInOrder(order: Order, subtotal: number) {
    const orderToUpdate = await this.orderRepository.findOneBy({
      id: order.id,
    });
    orderToUpdate.total += subtotal;
    await this.orderRepository.save(orderToUpdate);
  }

  private async subtractPriceInOrder(order: Order, subtotal: number) {
    const orderToUpdate = await this.orderRepository.findOneBy({
      id: order.id,
    });
    orderToUpdate.total -= subtotal;
    await this.orderRepository.save(orderToUpdate);
  }

  //! handle DB Exceptions

  private handleDBExceptions(error: any) {
    if (error.sqlState === '23000')
      throw new BadRequestException(error.sqlMessage); //! llave duplicada

    if (error.sqlState === 'HY000')
      throw new BadRequestException(error.sqlMessage); //! error de tipo de dato en la llave primaria

    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected Error, check server Logs',
    );
  }
}
