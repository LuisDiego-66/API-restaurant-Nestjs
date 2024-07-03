import { Order } from '../../orders/entities/order.entity';
import { Section } from '../../sections/entities/section.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TableStatus } from '../enum/table-status.enum';

@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('text')
  number: string;

  @Column('int', { default: 0 })
  ability: number;

  @Column({
    type: 'enum',
    enum: TableStatus,
    default: TableStatus.FREE,
  })
  status: string;

  @Column('varchar', { default: '' })
  tables: string;

  @Column('bool', { default: false })
  auxiliar: boolean;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true, select: false })
  deletedAt: Date;

  //* Relations

  @ManyToOne(() => Section, (section) => section.table)
  section: Section;

  @OneToMany(() => Order, (order) => order.table)
  order: Order;
}
