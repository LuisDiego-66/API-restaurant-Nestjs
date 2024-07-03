import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from './item.entity';
import { Variant } from '../../variants/entities/variant.entity';

@Entity('selected-variants')
export class SelectedVariants {
  @PrimaryGeneratedColumn()
  id: string;

  @DeleteDateColumn({ nullable: true, select: false })
  deletedAt: Date;

  //* Relations

  @ManyToOne(() => Item, (item) => item.selectedVariants, {
    onDelete: 'CASCADE',
  })
  item: Item;

  @ManyToOne(() => Variant, (variant) => variant.selectedVariants)
  variant: Variant;
}
