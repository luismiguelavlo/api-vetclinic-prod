/*
Table appointment {
  id uuid [pk]
  status AppointmentStatus [default: 'pending', not null]
  date datetime [not null]
  reason text [not null]

  user_id uuid [not null]
  pet_id uuid [not null]

  created_at datetime [default: 'now()']
}
*/

import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.model';
import { Pet } from './pet.model';

enum AppointmentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

@Entity()
export class Appointment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('enum', {
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
    nullable: false,
  })
  status: AppointmentStatus;

  @Column('timestamp', {
    nullable: false,
  })
  date: Date;

  @Column('text', {
    nullable: false,
  })
  reason: string;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.appointment)
  @JoinColumn({ name: 'doctor_user_id' })
  user: User;

  @ManyToOne(() => Pet, (pet) => pet.appointment)
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;
}
