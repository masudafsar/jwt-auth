import * as process from 'process';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function databaseConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USER || 'root',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'main-db',
    entities: ['dist/**/*.entity.{ts,js}'],
    migrations: ['dist/**/migrations/*.{ts,js}'],
    migrationsTableName: 'TypeORM_Migrations',
    synchronize: false,
    migrationsRun: true,
    logging: false,
  };
}
