import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '~/src/auth/auth.service';
import { RegisterDto } from '~/src/auth/dtos/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(
    @Body()
    registerDto: RegisterDto,
  ): Promise<any> {
    return this.authService.register(registerDto);
  }
}
