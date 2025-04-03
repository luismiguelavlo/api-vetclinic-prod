import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.model';

@Entity()
export class Doctor extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 30,
    nullable: false,
  })
  speciality: string;

  @OneToOne(() => User, (user) => user.doctor)
  user: User;
}
