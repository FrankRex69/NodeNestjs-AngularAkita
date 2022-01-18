import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test1 } from './modu/entities/test1/test1.entity';
import { Test2 } from './modu/entities/test2/test2.entity';
import { ModuModule } from './modu/modu.module';
import * as dotenv from 'dotenv';
import { User } from './modu/entities/user/user.entity';

dotenv.config();

const _ = {
  DB_HOST: process.env.PG_HOST,
  DB_PORT: process.env.PG_PORT,
  DB_DB: process.env.PG_DB,
  DB_SCHEMA: process.env.PG_SCHEMA,
  DB_USER: process.env.PG_USER,
  DB_PASSWORD: process.env.PG_PASSWORD,
};

console.log('DB_HOST: ' + _.DB_HOST);


@Module({
  imports: [
    ModuModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: _.DB_HOST,
      port: Number.parseInt(_.DB_PORT),
      database: _.DB_DB,
      username: _.DB_USER,
      password: _.DB_PASSWORD,
      schema: _.DB_SCHEMA,
      entities: [Test1, Test2, User],
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   database: 'dbTest',
    //   username: 'root',
    //   password: 'example',
    //   entities: [Test1, Test2],
    //   synchronize: true,
    //   autoLoadEntities: true,
    //   logging: true,
    // }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
