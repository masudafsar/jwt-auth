import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Table,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiPropertyOptional()
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ApiProperty()
  @Column({ name: 'email', unique: true, nullable: false })
  email: string;

  @ApiProperty()
  @Column({ name: 'password', nullable: false })
  password: string;

  @ApiPropertyOptional()
  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @ApiPropertyOptional()
  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @ApiPropertyOptional()
  @CreateDateColumn({ name: 'joined_at', type: 'timestamp with time zone' })
  joinedAt: Date;

  @ApiPropertyOptional()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'verified_at', type: 'timestamp with time zone' })
  verifiedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string) {
    return await bcrypt.compare(this.password, password);
  }
}
