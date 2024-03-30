import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { hash } from 'argon2';
import { UsersService } from '~/src/users/users.service';
import { jwtConfigType } from './config/jwt.config';
import { RegisterDto } from './dtos/register.dto';
import { AuthTokenDto } from '~/src/auth/dtos/auth-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthTokenDto> {
    try {
      const isUserExist = await this.usersService.findByUsername(
        registerDto.username,
      );
      if (isUserExist) throw new BadRequestException('Username was taken.');
    } catch (e) {}

    const newUser = await this.usersService.create(registerDto);
    const tokens = await this.getToken(newUser.id, newUser.username);
    await this.updateRefresh(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async updateRefresh(id: string, token: string): Promise<void> {
    // todo: implement token service first
  }

  private async getToken(id: string, username: string): Promise<AuthTokenDto> {
    const secrets = this.configService.get<jwtConfigType>('jwtConfig');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          username,
        },
        {
          secret: secrets.accessSecret,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          username,
        },
        {
          secret: secrets.refreshSecret,
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
