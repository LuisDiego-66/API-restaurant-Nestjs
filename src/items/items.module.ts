import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { SelectedVariants } from './entities/selected-variants.entity';
import { FoodsModule } from 'src/foods/foods.module';
import { OrdersModule } from 'src/orders/orders.module';
import { VariantsModule } from 'src/variants/variants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, SelectedVariants]),
    FoodsModule,
    OrdersModule,
    VariantsModule,
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
