import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  //? Create Category  ----------------------------------------------------------------------

  async create(
    createCategoryDto: CreateCategoryDto,
    file: Express.Multer.File,
  ) {
    try {
      const newCategory = this.categoryRepository.create(createCategoryDto);
      const categoryCreated = await this.categoryRepository.save(newCategory);
      const categoryCreatedWithUrl = await this.uploadImage(
        file,
        categoryCreated,
      );
      return categoryCreatedWithUrl;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //? FindAll Categories  ----------------------------------------------------------------------

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset = 0 } = paginationDto;
    const categories = await this.categoryRepository.find({
      take: limit,
      skip: offset,
      relations: { food: true },
    });
    return categories;
  }

  //? FindOne Category  ----------------------------------------------------------------------

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: { food: true },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  //? Update Category  ----------------------------------------------------------------------

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    file: Express.Multer.File,
  ) {
    try {
      const newCategory = await this.categoryRepository.preload({
        id,
        ...updateCategoryDto,
      });
      if (!newCategory)
        return new NotFoundException('Category not found').getResponse();

      if (!file) {
        const categoryUpdated = await this.categoryRepository.save(newCategory);
        return categoryUpdated;
      }
      await this.removeImage(newCategory);

      const categoryUpdatedWithUrl = this.uploadImage(file, newCategory);
      return categoryUpdatedWithUrl;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //? Remove Category  ----------------------------------------------------------------------

  async remove(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) throw new NotFoundException('Category not found');

    await this.removeImage(category); //! elimina la imagen
    const categoryDeleted = await this.categoryRepository.softRemove(category);

    return { ...categoryDeleted, eliminated: true };
  }

  //* Functions

  private handleDBExceptions(error: any) {
    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected Error, check server Logs',
    );
  }

  private async uploadImage(file: Express.Multer.File, category: Category) {
    const image = await this.cloudinaryService.uploadImage(file);
    const urlImage = image.secure_url;
    const categoryCreatedWithUrl = await this.categoryRepository.preload({
      ...category,
      urlImage: urlImage,
    });
    return this.categoryRepository.save(categoryCreatedWithUrl);
  }

  private async removeImage(category: Category) {
    const imageName = category.urlImage.split('/').pop().split('.')[0];
    await this.cloudinaryService.deleteImage(imageName);
    /*     let newUser = await this.userRepository.preload({
      ...user,
      urlImage: '',
    });
    newUser = await this.userRepository.save(newUser);
    return newUser; */
  }
}
