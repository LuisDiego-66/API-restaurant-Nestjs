import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CloudinaryService } from './cloudinary.service';
import { fileFilter } from './helpers/fileFilter.helper';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const image = await this.cloudinaryService.uploadImage(file);
    return { URL: image.secure_url };
  }
}
