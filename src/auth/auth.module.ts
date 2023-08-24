import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Session])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
