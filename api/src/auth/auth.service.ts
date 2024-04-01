import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '~/src/user/user.service';
import { jwtConfigType } from './configs/jwt.config';
import { RegisterDto } from './dtos/register.dto';
import { AuthTokenDto } from './dtos/auth-token.dto';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtPayloadType } from './types/jwt-payload-type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto, sessionTitle: string): Promise<AuthTokenDto> {
    const isUserExist = await this.usersService.findByUsername(registerDto.username);
    if (isUserExist) throw new BadRequestException('User already exists');

    const newUser = await this.usersService.create(registerDto);
    const tokens = await this.generateAuthTokens(newUser.id, newUser.username);
    await this.updateRefresh(newUser.id, tokens.refreshToken, sessionTitle);
    return tokens;
  }

  async updateRefresh(id: string, token: string, title?: string): Promise<void> {
    const user = await this.usersService.findOrFailById(id);
    const refreshToken = this.refreshTokenRepository.create({
      user,
      token,
      title: title || null,
    });
    await this.refreshTokenRepository.save(refreshToken);
  }

  private async generateAuthTokens(id: string, username: string): Promise<AuthTokenDto> {
    const secrets = this.configService.get<jwtConfigType>('jwtConfig');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          username,
        } as JwtPayloadType,
        {
          secret: secrets.accessSecret,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          username,
        } as JwtPayloadType,
        {
          secret: secrets.refreshSecret,
          expiresIn: '1m',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
