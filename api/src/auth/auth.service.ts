import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '~/src/user/user.service';
import { jwtConfigType } from './configs/jwt.config';
import { RegisterDto } from './dtos/register.dto';
import { AuthTokenDto } from './dtos/auth-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '~/src/auth/entities/refresh-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(
    registerDto: RegisterDto,
    title: string,
  ): Promise<AuthTokenDto> {
    try {
      const isUserExist = await this.usersService.findByUsername(
        registerDto.username,
      );
      if (isUserExist) throw new BadRequestException('Username was taken.');
    } catch (e) {}

    const newUser = await this.usersService.create(registerDto);
    const tokens = await this.generateAuthTokens(newUser.id, newUser.username);
    await this.updateRefresh(newUser.id, tokens.refreshToken, title);
    return tokens;
  }

  async updateRefresh(
    id: string,
    token: string,
    title?: string,
  ): Promise<void> {
    const user = await this.usersService.findById(id);
    const refreshToken = this.refreshTokenRepository.create({
      user,
      token,
      title: title || null,
    });
    await this.refreshTokenRepository.save(refreshToken);
  }

  private async generateAuthTokens(
    id: string,
    username: string,
  ): Promise<AuthTokenDto> {
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
