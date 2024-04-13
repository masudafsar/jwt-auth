import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe' })
  username: string;

  @ApiProperty()
  password: string;

  @ApiPropertyOptional({ example: 'John' })
  firstName?: string | null;

  @ApiPropertyOptional({ example: 'Doe' })
  lastName?: string | null;
}
