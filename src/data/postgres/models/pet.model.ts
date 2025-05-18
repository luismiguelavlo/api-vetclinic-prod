import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.model';
import { Appointment } from './appointment.model';
import { Specie } from './specie.model';
import { MedicalHistory } from './medical-history.model';

@Entity()
export class Pet extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float', { nullable: false })
  weight: number;

  @Column('varchar', { length: 30, nullable: false })
  name: string;

  @Column('varchar', { length: 30, nullable: false, default: 'unknown' })
  breed: string;

  @Column('boolean', { default: true, nullable: false })
  status: boolean;

  @ManyToOne(() => User, (user) => user.pet)
  @JoinColumn({ name: 'owner' })
  user: User;

  @OneToMany(() => Appointment, (appointment) => appointment.pet)
  appointment: Appointment[];

  @ManyToOne(() => Specie, (specie) => specie.pets)
  @JoinColumn({ name: 'specie_id' })
  specie: Specie;

  @OneToMany(() => MedicalHistory, (medicalHistory) => medicalHistory.pet)
  medicalHistory: MedicalHistory[];
}
