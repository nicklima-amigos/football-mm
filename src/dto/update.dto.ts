import { ApiProperty } from '@nestjs/swagger';

export class UpdateResponseDto {
  @ApiProperty()
  affected: number;
}
