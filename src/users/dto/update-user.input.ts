import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, Length, IsOptional, IsNumber } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(8, 8, { message: 'El DNI debe tener 8 caracteres.' }) // Longitud exacta de 8 caracteres
  dni: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'El nombre no puede exceder los 100 caracteres.' }) // Longitud máxima de 100 caracteres
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 100, {
    message: 'El apellido no puede exceder los 100 caracteres.',
  })
  last_name: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(9, 9, { message: 'El teléfono debe tener 9 caracteres.' })
  phone?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'El salario debe ser un número decimal con máximo dos decimales.',
    },
  )
  salary: number;
}
