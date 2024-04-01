import { UAParser } from 'ua-parser-js';
import { Body, Controller, Post, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dtos/register.dto';
import { AuthTokenDto } from './dtos/auth-token.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';

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
    const ua = UAParser(request.get('user-agent'));
    const sessionTitle = `${ua.os.name} (v${ua.os.version}): ${ua.browser.name} (${ua.browser.version})`;
    return this.authService.register(registerDto, sessionTitle);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async login(
    @Request()
    request: ExpressRequest,
    @Body()
    loginDto: LoginDto,
  ): Promise<AuthTokenDto> {
    const ua = UAParser(request.get('user-agent'));
    const sessionTitle = `${ua.os.name} (v${ua.os.version}): ${ua.browser.name} (${ua.browser.version})`;
    return this.authService.login(loginDto, sessionTitle);
  }
}
