import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RefreshToken } from '~/src/auth/entities/refresh-token.entity';

@Entity()
export class User {
  @ApiPropertyOptional()
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ApiProperty({ example: 'john.doe' })
  @Column({ name: 'username', unique: true, nullable: false })
  username: string;

  @ApiProperty()
  @Column({ name: 'password', nullable: false, select: false })
  password: string;

  @ApiPropertyOptional({ example: 'John' })
  @Column({ name: 'first_name', nullable: true })
  firstName: string | null;

  @ApiPropertyOptional({ example: 'Doe' })
  @Column({ name: 'last_name', nullable: true })
  lastName: string | null;

  @ApiPropertyOptional()
  @CreateDateColumn({ name: 'joined_at', type: 'timestamp with time zone' })
  joinedAt: Date;

  @ApiPropertyOptional()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @ApiPropertyOptional()
  @Column({
    name: 'verified_at',
    nullable: true,
    default: null,
    type: 'timestamp with time zone',
  })
  verifiedAt: Date | null;

  @OneToMany(() => RefreshToken, (token) => token.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  tokens: RefreshToken[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string) {
    return await bcrypt.compare(this.password, password);
  }
}
