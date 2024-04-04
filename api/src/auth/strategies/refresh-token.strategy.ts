import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as process from 'process';
import { Request } from 'express';
import { JwtPayloadType } from '../types/jwt-payload-type';
import { getBearerToken } from '~/src/common/utils/request';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayloadType): JwtPayloadType & { refreshToken: string } {
    const refreshToken = getBearerToken(req);
    return { ...payload, refreshToken };
  }
}
