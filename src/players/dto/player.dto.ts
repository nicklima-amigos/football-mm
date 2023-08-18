import { ApiProperty } from '@nestjs/swagger';

export class PlayerDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  birthDate: Date;

  @ApiProperty()
  position: string;

  @ApiProperty()
  elo: number;

  @ApiProperty()
  teamId: number;
}
