import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '~/src/users/users.module';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConfig } from './config/jwt.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from '~/src/auth/entities/refresh-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
      envFilePath: ['../.env'],
      load: [jwtConfig],
    }),
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule.register({}),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
