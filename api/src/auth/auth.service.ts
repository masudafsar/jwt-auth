import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '~/src/users/users.service';
import { RegisterDto } from '~/src/auth/dtos/register.dto';
import { hash } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const isUserExist = await this.usersService.findByUsername(
        registerDto.username,
      );
      if (isUserExist) throw new BadRequestException('User already exists');
    } catch (e) {}

    const hashedPassword = await hash(registerDto.password);
    const newUser = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });
    const tokens = await this.getToken(newUser.id, newUser.username);
    await this.updateRefresh(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async updateRefresh(id: string, token: string) {
    // todo: implement token service first
  }

  private async getToken(id: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
