import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Action } from './action.entity';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  rolName: string;

  @OneToMany(() => User, (user) => user.rol)
  users: User;

  @OneToMany(() => Action, (actions) => actions.rol, { cascade: true })
  actions?: Action[];
}
