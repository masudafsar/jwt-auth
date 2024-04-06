import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User } from '~/src/user/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { CreateRefreshTokenDto } from './dtos/create-refresh-token.dto';
import { RevokeRefreshTokenDto } from './dtos/revoke-refresh-token.dto';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
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

  async revoke(revokeRefreshTokenDto: RevokeRefreshTokenDto): Promise<void> {
    const { userId, token } = revokeRefreshTokenDto;
    const refreshToken = await this.refreshTokenRepository.findOneBy({
      user: { id: userId } as User,
      token: token,
      revokedAt: IsNull(),
    });
    if (!token) throw new NotFoundException(`Token not found`);
    const revokedToken = this.refreshTokenRepository.create({ revokedAt: new Date() });
    await this.refreshTokenRepository.update(refreshToken.id, revokedToken);
  }
}
