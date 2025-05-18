import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pet } from './pet.model';
import { Appointment } from './appointment.model';

@Entity()
export class MedicalHistory extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: false,
  })
  symptoms: string;

  @Column('text', {
    nullable: false,
  })
  diagnosis: string;

  @Column('text', {
    nullable: false,
  })
  treatment: string;

  @Column('text', {
    nullable: true,
  })
  medications: string;

  @Column('text', {
    nullable: true,
  })
  recommendations: string;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  consultation_date: Date;

  @ManyToOne(() => Pet, (pet) => pet.medicalHistory)
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @ManyToOne(() => Appointment, (appointment) => appointment.medicalHistory)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;
}
