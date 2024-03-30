import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@ApiTags('User')
@Controller({ path: 'user', version: ['1'] })
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all user' })
  async list(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details' })
  async details(
    @Param('id')
    id: string,
  ): Promise<User> {
    return this.usersService.findById(id);
  }

  @Get('username/:username')
  @ApiOperation({ summary: 'Get user details by username' })
  async detailsByUsername(
    @Param('username')
    username: string,
  ): Promise<User> {
    return this.usersService.findByUsername(username);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  async create(
    @Body()
    user: User,
  ): Promise<User> {
    return this.usersService.create(user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existed user' })
  async update(
    @Param('id')
    id: string,
    @Body()
    user: User,
  ): Promise<User> {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove an existed user' })
  async remove(
    @Param('id')
    id: string,
  ): Promise<void> {
    return this.usersService.remove(id);
  }
}
