import { PartialType } from '@nestjs/swagger';
import { CreateOffsideDto } from './create-offside.dto';

export class UpdateOffsideDto extends PartialType(CreateOffsideDto) {}
