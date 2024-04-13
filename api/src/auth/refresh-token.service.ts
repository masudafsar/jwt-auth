import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { IsNull, Repository } from 'typeorm';
import { User } from '~/src/user/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { CreateRefreshTokenDto } from './dtos/create-refresh-token.dto';
import { RevokeRefreshTokenDto } from './dtos/revoke-refresh-token.dto';
import { RefreshRefreshTokenDto } from './dtos/refresh-refresh-token.dto';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async list(userId: string): Promise<RefreshToken[]> {
    return await this.refreshTokenRepository.findBy({
      user: { id: userId } as User,
    });
  }

  async create(createRefreshTokenDto: CreateRefreshTokenDto): Promise<RefreshToken> {
    const token = await this.refreshTokenRepository.create(createRefreshTokenDto);
    return await this.refreshTokenRepository.save(token);
  }

  async revoke({ userId, token }: RevokeRefreshTokenDto): Promise<void> {
    const refreshToken = await this.refreshTokenRepository.findOneBy({
      user: { id: userId } as User,
      token: token,
      revokedAt: IsNull(),
    });
    if (!token) throw new UnauthorizedException(`Token not found`);
    const revokedToken = this.refreshTokenRepository.create({ revokedAt: new Date() });
    await this.refreshTokenRepository.update(refreshToken.id, revokedToken);
  }

  async refresh({ oldToken, newToken }: RefreshRefreshTokenDto): Promise<RefreshToken> {
    const token = await this.refreshTokenRepository.findOneBy({
      token: oldToken,
      revokedAt: IsNull(),
    });
    if (!token) throw new UnauthorizedException('Invalid token');
    const refreshedToken = this.refreshTokenRepository.create({ token: newToken });
    await this.refreshTokenRepository.update(token.id, refreshedToken);
    return await this.refreshTokenRepository.findOneBy({ id: token.id });
  }
}
