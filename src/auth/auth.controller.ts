import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('signin')
  async signIn(@Body() { usernameOrEmail, password }: SignInDto) {
    return await this.service.signIn({ usernameOrEmail, password });
  }

  @UseGuards(AuthGuard)
  @Get('authoriza')
  async authorize(@Request() req: any) {
    return req.user;
  }
}
