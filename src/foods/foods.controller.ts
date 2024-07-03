import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateFoodDto, UpdateFoodDto } from './dto';

import { fileFilter } from '../cloudinary/helpers/fileFilter.helper';
import { FoodsService } from './foods.service';

import { Auth } from '../auth/decorators/auth.decorator';
import { ValidActions } from '../auth/enums/valid-actions.enum';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFoodDto: CreateFoodDto,
  ) {
    if (!file)
      throw new BadRequestException('Make sure that the file is an image');
    return this.foodsService.create(createFoodDto, file);
  }

  //@Auth(ValidActions.ACTION_1, ValidActions.ACTION_2) //! se valida que se autentique y que su rol tenga la accion determinada
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.foodsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.foodsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFoodDto: UpdateFoodDto,
  ) {
    return this.foodsService.update(id, updateFoodDto, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.foodsService.remove(id);
  }
}
