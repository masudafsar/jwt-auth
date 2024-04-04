import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { UserService } from '~/src/user/user.service';
import { User } from '~/src/user/entities/user.entity';
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

  async login(loginDto: LoginDto, sessionTitle: string): Promise<AuthTokenDto> {
    const user = await this.usersService.findByUsername(loginDto.username);
    if (!user) throw new BadRequestException('Username or password is incorrect');

    const passwordMatched = await user.verifyPassword(loginDto.password);
    if (!passwordMatched) throw new BadRequestException('Username or password is incorrect');

    const tokens = await this.generateAuthTokens(user.id, user.username);
    await this.updateRefresh(user.id, tokens.refreshToken, sessionTitle);
    return tokens;
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    const token = await this.refreshTokenRepository.findOneBy({
      user: { id: userId } as User,
      token: refreshToken,
      revokedAt: IsNull(),
    });
    if (!token) throw new NotFoundException(`Token not found`);

    const revokedToken = this.refreshTokenRepository.create({ revokedAt: new Date() });
    await this.refreshTokenRepository.update(token.id, revokedToken);
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
          expiresIn: '30d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
