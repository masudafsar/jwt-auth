import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
