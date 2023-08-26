import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OffsideService } from './offside.service';
import { CreateOffsideDto } from './dto/create-offside.dto';
import { UpdateOffsideDto } from './dto/update-offside.dto';

@Controller('offside')
export class OffsideController {
  constructor(private readonly offsideService: OffsideService) {}

  @Post()
  create(@Body() createOffsideDto: CreateOffsideDto) {
    return this.offsideService.create(createOffsideDto);
  }

  @Get()
  findAll() {
    return this.offsideService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offsideService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOffsideDto: UpdateOffsideDto) {
    return this.offsideService.update(+id, updateOffsideDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offsideService.remove(+id);
  }
}
