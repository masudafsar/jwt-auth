import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const datasource = new DataSource({
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
  migrationsRun: false,
  logging: true,
  logger: 'advanced-console',
});

datasource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((reason) => {
    console.log('Error during Data Source initialization', reason);
  });

export default datasource;
