import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from "@nestjs/config";
import databaseConfig from "../config/database.config";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig]
    }),
    TypeOrmModule.forRoot(databaseConfig())
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
