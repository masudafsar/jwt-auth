import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '~/src/user/user.service';
import { RefreshTokenService } from './refresh-token.service';
import { jwtConfigType } from './configs/jwt.config';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthTokenDto } from './dtos/auth-token.dto';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtPayloadType } from './types/jwt-payload-type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenService: RefreshTokenService,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto, sessionTitle: string): Promise<AuthTokenDto> {
    const isUserExist = await this.usersService.findByUsername(registerDto.username);
    if (isUserExist) throw new BadRequestException('User already exists');

    const newUser = await this.usersService.create(registerDto);
    const tokens = await this.generateAuthTokens(newUser.id, newUser.username);
    await this.refreshTokenService.create({
      userId: newUser.id,
      token: tokens.refreshToken,
      title: sessionTitle,
    });
    return tokens;
  }

  async login(loginDto: LoginDto, sessionTitle: string): Promise<AuthTokenDto> {
    const user = await this.usersService.findByUsername(loginDto.username);
    if (!user) throw new BadRequestException('Username or password is incorrect');

    const passwordMatched = await user.verifyPassword(loginDto.password);
    if (!passwordMatched) throw new BadRequestException('Username or password is incorrect');

    const tokens = await this.generateAuthTokens(user.id, user.username);
    await this.refreshTokenService.create({
      userId: user.id,
      token: tokens.refreshToken,
      title: sessionTitle,
    });
    return tokens;
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.refreshTokenService.revoke({ userId, token: refreshToken });
  }

  private async generateAuthTokens(id: string, username: string): Promise<AuthTokenDto> {
    const payload: JwtPayloadType = {
      sub: id,
      username,
    };
    const secrets = this.configService.get<jwtConfigType>('jwtConfig');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: secrets.accessSecret,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: secrets.refreshSecret,
        expiresIn: '30d',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
