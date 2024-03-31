import { UAParser } from 'ua-parser-js';
import { Body, Controller, Post, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dtos/register.dto';
import { AuthTokenDto } from './dtos/auth-token.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller({ path: 'auth', version: ['1'] })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(
    @Request()
    request: ExpressRequest,
    @Body()
    registerDto: RegisterDto,
  ): Promise<AuthTokenDto> {
    const ua = UAParser(request.headers['user-agent']);
    const title = `${ua.os.name} (v${ua.os.version}): ${ua.browser.name} (${ua.browser.version})`;
    return this.authService.register(registerDto, title);
  }
}
