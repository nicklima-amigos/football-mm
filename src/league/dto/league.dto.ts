import { ApiProperty } from '@nestjs/swagger';
import { MatchDto } from '../../match/dto/match.dto';

export class LeagueDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: MatchDto, isArray: true })
  matches: MatchDto[];
}
