import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('signin')
  async signIn(@Body() { usernameOrEmail, password }: SignInDto) {
    return await this.service.signIn({ usernameOrEmail, password });
  }

  @Get('authorize')
  async authorize(@Req() req: Request) {
    return await this.service.authorize(req.headers.authorization);
  }
}
