import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User id '${id}'not found`);
    return user;
  }

  async create(user: User): Promise<User> {
    const createdUser = this.userRepository.create(user);
    return await this.userRepository.save(createdUser);
  }

  async update(id: string, user: User): Promise<User> {
    const prevUserData = await this.findById(id);
    const nextUserData = this.userRepository.create({
      ...prevUserData,
      ...user,
    });
    await this.userRepository.update(id, nextUserData);
    return await this.findById(user.id);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.userRepository.delete(id);
  }
}
