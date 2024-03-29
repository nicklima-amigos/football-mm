import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn({ usernameOrEmail, password }: SignInDto) {
    this.logger.log('Signing in user');
    const user = await this.userService.findOneByUsernameOrEmail(
      usernameOrEmail,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.jwtService.signAsync({
      username: user.username,
      sub: user.id,
      email: user.email,
    });
    return {
      token,
      id: user.id,
      username: user.username,
      email: user.email,
      player: user.player,
    };
  }
}
