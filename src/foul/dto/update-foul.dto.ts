import { PartialType } from '@nestjs/swagger';
import { CreateFoulDto } from './create-foul.dto';

export class UpdateFoulDto extends PartialType(CreateFoulDto) {}
