import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Order } from '../../orders/entities/order.entity';
import { SelectedVariants } from './selected-variants.entity';
import { Food } from '../../foods/entities/food.entity';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('int', { default: 1 })
  amount: number;

  @Column('float', { default: 0 })
  subtotal: number;

  @Column('float', { default: 0 })
  discount: number;

  @Column('float', { default: 0 })
  priceFood: number;

  @Column('float', { default: 0 })
  priceVariants: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true, select: false })
  deletedAt: Date;

  //* Relations

  @ManyToOne(() => Food, (food) => food.item)
  food: Food;

  @ManyToOne(() => Order, (order) => order.item)
  order: Order;

  @OneToMany(
    () => SelectedVariants,
    (selectedVariants) => selectedVariants.item,
    { cascade: true },
  )
  selectedVariants: SelectedVariants[];

  @BeforeInsert()
  calculateSubtotalInsert() {
    this.addSubtotal();
  }

  @BeforeUpdate()
  calculateSubtotalUpdate() {
    this.addSubtotal();
  }

  private addSubtotal() {
    this.subtotal = this.amount * (this.priceFood + this.priceVariants);
  }
}
