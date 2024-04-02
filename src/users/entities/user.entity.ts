import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Rol } from 'src/auth/entities/rol.entity';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('text')
  fullName: string;

  @ManyToOne(() => Rol, (rol) => rol.users, { eager: true })
  rol: Rol;
}
