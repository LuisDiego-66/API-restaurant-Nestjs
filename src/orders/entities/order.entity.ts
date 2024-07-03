import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from '../../items/entities/item.entity';
import { User } from '../../users/entities/user.entity';
import { Table } from '../../tables/entities/table.entity';
import { Client } from '../../clients/entities/client.entity';
import { OrderStatus } from '../enum/order-status.enum';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /* @Column('int')
people:number */

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: string; //! cambiar a enum

  @Column('float', { default: 0 })
  total: number;

  @Column('float', { default: 0 })
  discount: number;

  @Column('varchar', { default: '' })
  time: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true, select: false })
  deletedAt: Date;

  //* Relations

  @OneToMany(() => Item, (item) => item.order)
  item: Item[];

  @ManyToOne(() => User, (user) => user.order)
  user: User;

  @ManyToOne(() => Table, (table) => table.order)
  table: Table;

  @ManyToOne(() => Client, (client) => client.order)
  client: Client;
}
