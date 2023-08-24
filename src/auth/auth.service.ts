import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { verify } from 'argon2';
import { UserService } from '../user/user.service';
import { SignInDto } from './dto/sign-in.dto';
import { Session } from './entities/session.entity';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(Session) private repository,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn({ usernameOrEmail, password }: SignInDto) {
    const user = await this.userService.findOneByUsernameOrEmail(
      usernameOrEmail,
    );
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
