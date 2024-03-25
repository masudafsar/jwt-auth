import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '~/src/app.controller';
import { AppService } from '~/src/app.service';
import { databaseConfig } from '~/config/database.config';
import { UsersModule } from '~/src/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../.env'],
      load: [databaseConfig],
    }),
    TypeOrmModule.forRoot(databaseConfig()),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}