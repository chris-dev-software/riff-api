import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('attendances')
export class Attendance {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'date' })
  date: string;

  @Field()
  @Column({ type: 'time' })
  time_entry: string;

  @Field()
  @Column({ type: 'time' })
  time_departure: string;

  @Field()
  @Column({
    type: 'enum',
    enum: ['presente', 'ausente', 'tarde', 'justificado'],
    default: 'presente',
  })
  state: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.attendances)
  user: User;
}
