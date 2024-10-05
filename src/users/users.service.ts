import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import * as bcrypt from 'bcryptjs';
import { UpdateUserInput } from './dto/update-user.input';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      const users = await this.usersRepository.find({
        where: {
          rol: 'user',
        },
      });
      return users;
    } catch {
      throw new Error('Error al obtener los usuarios');
    }
  }

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    try {
      const { password, dni, ...otherUserData } = createUserInput;

      const userFound = await this.usersRepository.findOne({
        where: { dni },
      });

      if (userFound) {
        throw new ConflictException('El usuario ya existe');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = this.usersRepository.create({
        ...otherUserData,
        password: hashedPassword,
        rol: 'user',
        dni,
      });

      return this.usersRepository.save(newUser);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al crear el usuario: ' + error.message,
      );
    }
  }

  async updateUser(
    id: number,
    updateUserInput: UpdateUserInput,
  ): Promise<User> {
    try {
      const { dni } = updateUserInput;

      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user) {
        throw new Error('El usuario no existe');
      }

      if (dni) {
        const userFound = await this.usersRepository.findOne({
          where: { dni },
        });
        if (userFound && userFound.id !== id) {
          throw new ConflictException('El DNI ya está en uso por otro usuario');
        }
      }

      const updatedUser = Object.assign(user, updateUserInput);

      return this.usersRepository.save(updatedUser);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al actualizar el usuario: ' + error.message,
      );
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      await this.usersRepository.delete(id);
      return true;
    } catch {
      throw new Error('Error al eliminar el usuario');
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return user;
    } catch {
      throw new Error('Error al obtener el usuario');
    }
  }
}
