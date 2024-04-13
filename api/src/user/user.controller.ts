import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@ApiTags('User')
@Controller({ path: 'user', version: ['1'] })
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all user' })
  @ApiResponse({ type: User, isArray: true })
  async list(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details' })
  @ApiResponse({ type: User })
  async details(
    @Param('id')
    id: string,
  ): Promise<User> {
    return this.usersService.findOrFailById(id);
  }

  @Get('username/:username')
  @ApiOperation({ summary: 'Get user details by username' })
  @ApiResponse({ type: User })
  async detailsByUsername(
    @Param('username')
    username: string,
  ): Promise<User> {
    return this.usersService.findOrFailByUsername(username);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ type: User })
  async create(
    @Body()
    user: CreateUserDto,
  ): Promise<User> {
    return this.usersService.create(user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existed user' })
  @ApiResponse({ type: User })
  async update(
    @Param('id')
    id: string,
    @Body()
    user: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove an existed user' })
  @ApiResponse({ type: undefined })
  async remove(
    @Param('id')
    id: string,
  ): Promise<void> {
    return this.usersService.remove(id);
  }
}
