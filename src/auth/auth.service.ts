import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { UserService } from '../user/user.service';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private userService: UserService,
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
    const isPasswordValid = await verify(user?.password, password);
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
    };
  }
}
