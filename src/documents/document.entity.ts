import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('documents')
export class Document {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({
    type: 'enum',
    enum: ['remuneración', 'gratificación'],
  })
  type: string;

  @Field()
  @Column({
    type: 'enum',
    enum: [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ],
  })
  month: string;

  @Field()
  @Column({ type: 'int' })
  year: number;

  @Field()
  @Column()
  url: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.documents)
  user: User;
}
