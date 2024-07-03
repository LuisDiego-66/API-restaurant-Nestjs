import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Rol } from './rol.entity';
import { ValidActions } from '../enums/valid-actions.enum';

@Entity('actions')
export class Action {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'enum',
    enum: ValidActions,
    default: ValidActions.ACTION_1,
  })
  actionName: string;

  //* Relations

  @ManyToOne(() => Rol, (rol) => rol.actions, { eager: true })
  rol: Rol;
}
