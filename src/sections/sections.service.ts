import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateSectionDto, UpdateSectionDto } from './dto';
import { Section } from './entities/section.entity';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
  ) {}

  //? Create Section  ----------------------------------------------------------------------

  async create(createSectionDto: CreateSectionDto) {
    try {
      const newSection = this.sectionRepository.create(createSectionDto);
      const sectionCreated = await this.sectionRepository.save(newSection);
      return sectionCreated;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //? FindAll Section  ----------------------------------------------------------------------

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset = 0 } = paginationDto;
    const sections = await this.sectionRepository.find({
      take: limit,
      skip: offset,
      relations: { table: true },
    });
    return sections;
  }

  //? FindOne Section  ----------------------------------------------------------------------

  async findOne(id: string) {
    const section = await this.sectionRepository.findOne({
      where: { id },
      relations: { table: true },
    });
    if (!section) throw new NotFoundException('Section not found');
    return section;
  }

  //? Update Section  ----------------------------------------------------------------------

  async update(id: string, updateSectionDto: UpdateSectionDto) {
    try {
      const newSection = await this.sectionRepository.preload({
        id,
        ...updateSectionDto,
      });
      if (!newSection)
        return new NotFoundException('Section not found').getResponse();
      const sectionUpdated = await this.sectionRepository.save(newSection);
      return sectionUpdated;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //? Remove Section  ----------------------------------------------------------------------

  async remove(id: string) {
    const section = await this.sectionRepository.findOne({
      where: { id },
    });
    if (!section) throw new NotFoundException('Section not found');

    const sectionDeleted = await this.sectionRepository.softRemove(section);
    return { ...sectionDeleted, eliminated: true };
  }

  //* Functions

  private handleDBExceptions(error: any) {
    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected Error, check server Logs',
    );
  }
}
