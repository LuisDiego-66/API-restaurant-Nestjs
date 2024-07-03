import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Rol } from '../../auth/entities/rol.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, length: 50 })
  email: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('text')
  fullName: string;

  @Column({ type: 'varchar', unique: true })
  pin: string;

  @Column('text')
  cellPhone: string; //! validar

  @Column('text')
  address: string;

  @Column('varchar', { default: '' }) //! por defecto
  urlImage: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true, select: false })
  deletedAt: Date;

  //* Relations

  @ManyToOne(() => Rol, (rol) => rol.users, { eager: true })
  rol: Rol;

  @OneToMany(() => Order, (order) => order.user)
  order: Order[];

  //* Functions

  @BeforeInsert()
  hashingPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
    //this.pin = bcrypt.hashSync(this.pin, 10); //! hashear el pin
  }
}
