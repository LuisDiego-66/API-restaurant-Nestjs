import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DataSource, Repository } from 'typeorm';

import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateVariantDto, UpdateVariantDto } from './dto';
import { Variant } from './entities/variant.entity';
import { Option } from './entities/option.entity';

@Injectable()
export class VariantsService {
  constructor(
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,
    private readonly dataSourse: DataSource,
  ) {}

  //? Create Variant  ----------------------------------------------------------------------

  //! Mejorar
  async create(createVariantDto: CreateVariantDto) {
    try {
      const { options = [], ...variantDetails } = createVariantDto;

      const newVariant = this.variantRepository.create({
        ...variantDetails,
        options: options.map((option) => this.optionRepository.create(option)),
      });

      const variantCreated = await this.variantRepository.save(newVariant);
      return variantCreated;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //? FindAll Variant  ----------------------------------------------------------------------

  findAll(paginationDto: PaginationDto) {
    const { limit, offset = 0 } = paginationDto;
    const variants = this.variantRepository.find({
      take: limit,
      skip: offset,
      relations: { options: true },
    });
    return variants;
  }

  //? FindOne Variant  ----------------------------------------------------------------------

  async findOne(id: string) {
    const variant = await this.variantRepository.findOne({
      where: { id },
      relations: { options: true },
    });
    if (!variant) throw new NotFoundException('Variant not found');
    return variant;
  }

  //? Update Variant  ----------------------------------------------------------------------

  async update(id: string, updateVariantDto: UpdateVariantDto) {
    const { options, ...toUpdate } = updateVariantDto;

    const newVariant = await this.variantRepository.preload({
      id,
      ...toUpdate,
    });

    if (!newVariant)
      return new NotFoundException('Variant not found').getResponse();

    const queryRunner = this.dataSourse.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (options) {
        await queryRunner.manager.delete(Option, {
          variant: { id: id },
        });
        newVariant.options = options.map((option) =>
          this.optionRepository.create(option),
        );
      }
      await queryRunner.manager.save(newVariant);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      const fullVariant = await this.findOne(newVariant.id);

      return fullVariant;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBExceptions(error);
    }
  }

  //? Remove Variant  ----------------------------------------------------------------------

  async remove(id: string) {
    const variant = await this.variantRepository.findOne({
      where: { id },
      relations: { options: true },
    });
    if (!variant) throw new NotFoundException('Variant not found');

    const variantDeleted = await this.variantRepository.softRemove(variant);
    return { ...variantDeleted, eliminated: true };
  }

  //* Functions

  private handleDBExceptions(error: any) {
    if (error.sqlState === '23000')
      throw new BadRequestException(error.sqlMessage); //! error de "no existe Food"

    if (error.sqlState === 'HY000')
      throw new BadRequestException(error.sqlMessage); //! error de tipo de dato en la llave primaria

    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected Error, check server Logs',
    );
  }
}
