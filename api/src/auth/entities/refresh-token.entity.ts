import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '~/src/user/entities/user.entity';

@Entity()
export class RefreshToken {
  @ApiPropertyOptional()
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ApiProperty({ example: '<refresh token>' })
  @Column({ name: 'token', unique: true, nullable: false })
  token: string;

  @ApiPropertyOptional({ example: 'Google Chrome' })
  @Column({ name: 'title', nullable: true })
  title: string;

  @ManyToOne(() => User, (user) => user.tokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  user: User;

  @ApiPropertyOptional()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @ApiPropertyOptional()
  @Column({ name: 'revoked_at', type: 'timestamp with time zone' })
  revokedAt: Date;
}
