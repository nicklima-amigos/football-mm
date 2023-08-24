import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { verify } from 'argon2';
import { SignInDto } from './dto/sign-in.dto';
import { Session } from './entities/session.entity';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(Session) private repository,
    private userService: UserService,
  ) {}

  async signIn({ usernameOrEmail, password }: SignInDto) {
    const user = await this.userService.findOneByUsernameOrEmail(
      usernameOrEmail,
    );
    const isPasswordValid = await verify(user?.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const session: Session = await this.repository.save({
      user,
      token: randomUUID(),
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
    this.logger.log({ session });
    return {
      token: session.token,
    };
  }

  async authorize(token: string) {
    const tokenObj = await this.repository.findOne({ where: { token } });
    if (!tokenObj) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
