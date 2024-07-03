import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Food } from '../../foods/entities/food.entity';
import { CategoryStatus } from '../enum/category-status.enum';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('varchar', { default: '' }) //! por defecto
  urlImage: string;

  @Column({
    type: 'enum',
    enum: CategoryStatus,
    default: CategoryStatus.ENABLED,
  })
  status: string;

  @Column('int', { default: 0 })
  startTime?: number;

  @Column('int', { default: 0 })
  endTime?: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true, select: false })
  deletedAt: Date;

  //* Relations

  @OneToMany(() => Food, (food) => food.category)
  food: Food[];
}
