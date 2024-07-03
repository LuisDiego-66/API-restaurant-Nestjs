import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Table } from '../../tables/entities/table.entity';
import { SectionStatus } from '../enum/section-status.enum';

@Entity('sections')
export class Section {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: SectionStatus,
    default: SectionStatus.ENABLED,
  })
  status: string; //! enum en el dto

  @Column('int', { default: 0 })
  startTime: number;

  @Column('int', { default: 0 })
  endTime: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true, select: false })
  deletedAt: Date;

  //* Relations
  @OneToMany(() => Table, (table) => table.section)
  table: Table[];
}
