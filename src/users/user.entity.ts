import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Schedule } from '../schedules/schedule.entity';
import { Attendance } from '../attendances/attendance.entity';
import { Document } from '../documents/document.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 8, unique: true })
  dni: string;

  @Field()
  @Column({ length: 100 })
  name: string;

  @Field()
  @Column({ length: 100 })
  last_name: string;

  @Field({ nullable: true })
  @Column({ length: 9 })
  phone?: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  salary: number;

  @Field()
  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  rol: string;

  @Column({ nullable: false })
  password: string;

  @Field(() => [Schedule])
  @OneToMany(() => Schedule, (schedule) => schedule.user)
  schedules: Schedule[];

  @Field(() => [Attendance])
  @OneToMany(() => Attendance, (attendance) => attendance.user)
  attendances: Attendance[];

  @Field(() => [Document])
  @OneToMany(() => Document, (document) => document.user)
  documents: Document[];
}
