import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Variant } from '../../variants/entities/variant.entity';

@Entity('options')
export class Option {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('text')
  name: string;

  @Column('varchar', { default: '' })
  description: string;

  @Column('float', { default: 0 })
  price: number;

  @DeleteDateColumn({ nullable: true, select: false })
  deletedAt: Date;

  //* Relations

  @ManyToOne(() => Variant, (variant) => variant.options)
  variant: Variant;
}
