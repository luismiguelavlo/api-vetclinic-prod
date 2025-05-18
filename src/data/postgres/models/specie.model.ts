import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pet } from './pet.model';

@Entity()
export class Specie extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 30, nullable: false, unique: true })
  name: string;

  @Column('varchar', { length: 255, nullable: true })
  img_url: string;

  @OneToMany(() => Pet, (pet) => pet.specie)
  pets: Pet[];
}
