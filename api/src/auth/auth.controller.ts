import { UAParser } from 'ua-parser-js';
import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dtos/register.dto';
import { AuthTokenDto } from './dtos/auth-token.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenGuard } from '~/src/common/guards/refreshToken.guard';

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

  @UseGuards(RefreshTokenGuard)
  @Get('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  async logout(
    @Request()
    request: ExpressRequest,
  ): Promise<any> {
    const userId = request.user['sub'];
    const token = request.get('Authorization').replace('Bearer', '').trim();
    return this.authService.logout(userId, token);
  }
}
