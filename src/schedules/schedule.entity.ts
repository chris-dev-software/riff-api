import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('schedules')
export class Schedule {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({
    type: 'enum',
    enum: [
      'lunes',
      'martes',
      'miércoles',
      'jueves',
      'viernes',
      'sábado',
      'domingo',
    ],
  })
  weekday: string;

  @Field()
  @Column({ type: 'time' })
  start_time: string;

  @Field()
  @Column({ type: 'time' })
  end_time: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.schedules)
  user: User;
}
