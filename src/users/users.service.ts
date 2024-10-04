import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  findAll(): User[] {
    return [
      {
        id: 1,
        dni: '12345678',
        name: 'Juan',
        last_name: 'Perez',
        phone: '987654321',
        salary: 2500.5,
        rol: 'user',
        password: 'hashedPassword1',
        schedules: [],
        attendances: [
          {
            id: 1,
            date: '2024-10-01',
            time_entry: '08:05',
            time_departure: '17:00',
            state: 'presente',
            user: null,
          },
          {
            id: 2,
            date: '2024-10-02',
            time_entry: '08:10',
            time_departure: '16:55',
            state: 'tarde',
            user: null,
          },
        ],
        documents: [
          {
            id: 1,
            type: 'remuneración',
            month: 'octubre',
            year: 2024,
            url: 'https://example.com/documents/1',
            user: null,
          },
        ],
      },
      {
        id: 2,
        dni: '87654321',
        name: 'Maria',
        last_name: 'Lopez',
        phone: '912345678',
        salary: 3200.75,
        rol: 'admin',
        password: 'hashedPassword2',
        schedules: [
          {
            id: 3,
            weekday: 'miércoles',
            start_time: '09:00',
            end_time: '18:00',
            user: null,
          },
          {
            id: 4,
            weekday: 'jueves',
            start_time: '09:00',
            end_time: '18:00',
            user: null,
          },
        ],
        attendances: [
          {
            id: 3,
            date: '2024-10-01',
            time_entry: '09:00',
            time_departure: '18:00',
            state: 'presente',
            user: null,
          },
        ],
        documents: [
          {
            id: 2,
            type: 'gratificación',
            month: 'julio',
            year: 2024,
            url: 'https://example.com/documents/2',
            user: null,
          },
        ],
      },
    ];
  }
}
