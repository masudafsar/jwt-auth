import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User '${id}' not found`);
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) throw new NotFoundException(`'${username}' not found`);
    return user;
  }

  async create(user: DeepPartial<User>): Promise<User> {
    const createdUser = this.userRepository.create(user);
    return await this.userRepository.save(createdUser);
  }

  async update(id: string, user: DeepPartial<User>): Promise<User> {
    await this.findById(id);
    const updatedUser = this.userRepository.create(user);
    await this.userRepository.update(id, updatedUser);
    return await this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.userRepository.delete(id);
  }
}
