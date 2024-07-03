import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateFoodDto, UpdateFoodDto } from './dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Food } from './entities/food.entity';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  //? Create Food  ----------------------------------------------------------------------

  async create(createFoodDto: CreateFoodDto, file: Express.Multer.File) {
    try {
      const newFood = this.foodRepository.create(createFoodDto);
      const foodCreated = await this.foodRepository.save(newFood);
      const foodCreatedWithUrl = await this.uploadImage(file, foodCreated);
      return foodCreatedWithUrl;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //? FindAll Foods  ----------------------------------------------------------------------

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset = 0 } = paginationDto;
    const foods = await this.foodRepository.find({
      //!obtener la hora actual
      /*       where: {
        total: Between(3,8)
      }, */
      take: limit,
      skip: offset,
      relations: { variant: { options: true } },
    });
    return foods;
  }

  //? FindOne Food  ----------------------------------------------------------------------

  async findOne(id: string) {
    const food = await this.foodRepository.findOne({
      where: { id },
      relations: { variant: { options: true } },
    });
    if (!food) throw new NotFoundException('Food not found');
    return food;
  }

  //? Update Food  ----------------------------------------------------------------------

  async update(
    id: string,
    updateFoodDto: UpdateFoodDto,
    file: Express.Multer.File,
  ) {
    try {
      const newFood = await this.foodRepository.preload({
        id,
        ...updateFoodDto,
      });
      if (!newFood)
        return new NotFoundException('Food not found').getResponse();

      if (!file) {
        const foodUpdated = await this.foodRepository.save(newFood);
        return foodUpdated;
      }
      await this.removeImage(newFood);

      const foodUpdatedWithUrl = this.uploadImage(file, newFood);
      return foodUpdatedWithUrl;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //? Remove Food  ----------------------------------------------------------------------

  async remove(id: string) {
    const food = await this.foodRepository.findOne({
      where: { id },
    });
    if (!food) throw new NotFoundException('Food not found');

    await this.removeImage(food); //! elimina la imagen
    const foodDeleted = await this.foodRepository.softRemove(food);

    return { ...foodDeleted, eliminated: true };
  }

  //* Functions

  private handleDBExceptions(error: any) {
    if (error.sqlState === '23000')
      throw new BadRequestException(error.sqlMessage); //! error de "no existe la categoria"
    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected Error, check server Logs',
    );
  }

  private async uploadImage(file: Express.Multer.File, food: Food) {
    const image = await this.cloudinaryService.uploadImage(file);
    const urlImage = image.secure_url;
    const foodCreatedWithUrl = await this.foodRepository.preload({
      ...food,
      urlImage: urlImage,
    });
    return this.foodRepository.save(foodCreatedWithUrl);
  }

  private async removeImage(food: Food) {
    const imageName = food.urlImage.split('/').pop().split('.')[0];
    await this.cloudinaryService.deleteImage(imageName);
    /*     let newUser = await this.userRepository.preload({
      ...user,
      urlImage: '',
    });
    newUser = await this.userRepository.save(newUser);
    return newUser; */
  }
}
