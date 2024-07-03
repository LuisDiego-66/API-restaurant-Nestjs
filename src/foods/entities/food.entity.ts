import { Variant } from 'src/variants/entities/variant.entity';
import { Category } from '../../categories/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FoodStatus } from '../enum/food-status.enum';
import { Item } from '../../items/entities/item.entity';

@Entity('foods')
export class Food {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('float')
  price: number;

  @Column('float', { default: 0 })
  s1_price: number;
  @Column('float', { default: 0 })
  s2_price: number;
  @Column('float', { default: 0 })
  s3_price: number;

  @Column('varchar', { default: '' }) //! por defecto
  urlImage: string;

  @Column({
    type: 'enum',
    enum: FoodStatus,
    default: FoodStatus.ENABLED,
  })
  status: string;

  @Column('int', { default: 0 })
  startTime: number;

  @Column('int', { default: 0 })
  endTime: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true, select: false })
  deletedAt: Date;

  //* Relations

  @ManyToOne(() => Category, (category) => category.food)
  category: Category;

  @OneToMany(() => Variant, (variant) => variant.food)
  variant: Variant[];

  @OneToMany(() => Item, (item) => item.food)
  item: Item[];
}
