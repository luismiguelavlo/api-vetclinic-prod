import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pet } from './pet.model';
import { Appointment } from './appointment.model';
import { Doctor } from './doctor.model';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  DOCTOR = 'doctor',
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 70,
    nullable: false,
  })
  fullname: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
  })
  password: string;

  @Column('varchar', {
    length: 50,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column('varchar', {
    length: 20,
    nullable: false,
  })
  phone_number: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
  })
  photo_url: string;

  @Column('enum', {
    enum: UserRole,
    default: UserRole.USER,
    nullable: false,
  })
  rol: UserRole;

  @Column('boolean', {
    default: true,
    nullable: false,
  })
  status: boolean;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  created_at: Date;

  @OneToMany(() => Pet, (pet) => pet.user)
  pet: Pet[];

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointment: Appointment[];

  @OneToOne(() => Doctor, (doctor) => doctor.user)
  @JoinColumn({ name: 'speciality' })
  doctor: Doctor;
}
