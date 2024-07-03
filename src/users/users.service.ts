import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateUserDto, UpdateUserDto } from './dto';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  //? Create User  ----------------------------------------------------------------------

  async create(createUserDto: CreateUserDto, file: Express.Multer.File) {
    try {
      //! verificar si el pin existe
      const newUser = this.userRepository.create(createUserDto);
      const userCreated = await this.userRepository.save(newUser);
      const userCreatedWithUrl = await this.uploadImage(file, userCreated);
      return userCreatedWithUrl;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //? FindAll User  ----------------------------------------------------------------------

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset = 0 } = paginationDto;
    const users = await this.userRepository.find({
      take: limit,
      skip: offset,
      relations: { rol: true },
    });
    return users;
  }

  //? FindOne User  ----------------------------------------------------------------------

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { rol: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  //? Update User  ----------------------------------------------------------------------

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ) {
    try {
      const newUser = await this.userRepository.preload({
        id,
        ...updateUserDto,
      });
      if (!newUser)
        return new NotFoundException('User not found').getResponse();

      if (!file) {
        const userUpdated = await this.userRepository.save(newUser);
        const fullUser = this.findOne(userUpdated.id);
        return fullUser;
      }
      await this.removeImage(newUser); //! elimina la imagen

      const userUpdatedWithUrl = this.uploadImage(file, newUser); //! sube la nueva imagen

      const fullUser = this.findOne((await userUpdatedWithUrl).id);
      return fullUser;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //? Remove User  ----------------------------------------------------------------------

  async remove(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not found');

    await this.removeImage(user); //! elimina la imagen
    const userDeleted = await this.userRepository.softRemove(user);

    return { ...userDeleted, eliminated: true };
  }

  //* Functions

  private async uploadImage(file: Express.Multer.File, user: User) {
    const image = await this.cloudinaryService.uploadImage(file);
    const urlImage = image.secure_url;
    const userCreatedWithUrl = await this.userRepository.preload({
      ...user,
      urlImage: urlImage,
    });
    return this.userRepository.save(userCreatedWithUrl);
  }

  private async removeImage(user: User) {
    const imageName = user.urlImage.split('/').pop().split('.')[0];
    await this.cloudinaryService.deleteImage(imageName);
    /*     let newUser = await this.userRepository.preload({
      ...user,
      urlImage: '',
    });
    newUser = await this.userRepository.save(newUser);
    return newUser; */
  }

  //! handle DB Exceptions

  private handleDBExceptions(error: any) {
    if (error.sqlState === '23000')
      throw new BadRequestException(error.sqlMessage); //! error de "email repetido"
    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected Error, check server Logs',
    );
  }
}
