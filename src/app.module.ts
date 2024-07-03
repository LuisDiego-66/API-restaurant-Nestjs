import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { FoodsModule } from './foods/foods.module';
import { TablesModule } from './tables/tables.module';
import { SectionsModule } from './sections/sections.module';
import { OrdersModule } from './orders/orders.module';
import { ItemsModule } from './items/items.module';
import { VariantsModule } from './variants/variants.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ClientsModule } from './clients/clients.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),

    AuthModule,

    UsersModule,

    CategoriesModule,

    FoodsModule,

    TablesModule,

    SectionsModule,

    OrdersModule,

    ItemsModule,

    VariantsModule,

    CloudinaryModule,

    ClientsModule,

    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
