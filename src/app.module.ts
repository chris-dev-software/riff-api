import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { SchedulesModule } from './schedules/schedules.module';
import { AttendancesModule } from './attendances/attendances.module';
import { DocumentsModule } from './documents/documents.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      port: 5432,
      username: 'postgres',
      password: 'Tkmmiangelbebe2424',
      database: 'riff',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    SchedulesModule,
    AttendancesModule,
    DocumentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
