import { Food } from 'src/foods/entities/food.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VariantStatus } from '../enum/variant-status.enum';
import { Option } from '../entities/option.entity';
import { SelectedVariants } from '../../items/entities/selected-variants.entity';

@Entity('variants')
export class Variant {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: VariantStatus,
    default: VariantStatus.SINGULAR,
  })
  status: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true, select: false })
  deletedAt: Date;

  //* Relations

  @ManyToOne(() => Food, (food) => food.variant)
  food: Food;

  @OneToMany(() => Option, (option) => option.variant, {
    cascade: true,
    //eager: true,
  })
  options: Option[];

  @OneToMany(
    () => SelectedVariants,
    (selectedVariants) => selectedVariants.variant,
  )
  selectedVariants: SelectedVariants[];
}
