import { Module } from '@nestjs/common';

import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryProvider } from './providers/cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';

@Module({
  controllers: [CloudinaryController],
  providers: [CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
