import { IsDateString, IsString } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  name: string;

  @IsDateString()
  birthDate: Date;

  @IsString()
  position: string;
}
