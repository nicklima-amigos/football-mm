import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.log('Creating user');
    await this.validateCreateUser(createUserDto);
    createUserDto.password = await hash(createUserDto.password, 10);
    delete createUserDto.confirmPassword;
    return await this.repository.save(createUserDto);
  }

  async findAll() {
    const users = await this.repository.find();
    return users.map((user) => {
      delete user.password;
      return user;
    });
  }

  async findOne(id: number) {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByUsernameOrEmail(userNameOrEmail: string) {
    const userByUsername = await this.repository.findOne({
      where: { username: userNameOrEmail },
    });
    if (userByUsername) {
      return userByUsername;
    }
    const userByEmail = await this.repository.findOne({
      where: { email: userNameOrEmail },
    });
    if (userByEmail) {
      return userByEmail;
    }
    throw new NotFoundException('User not found');
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    await this.validateUpdateUser(user.id, updateUserDto);
    return this.repository.save({ ...updateUserDto, id });
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.repository.remove(user);
  }

  private async validateUpdateUser(id: number, updateUserDto: UpdateUserDto) {
    const conflictingUser = await this.repository
      .createQueryBuilder('user')
      .where(
        '(user.email = :email OR user.username = :username) AND user.id != :id',
        {
          email: updateUserDto.email,
          username: updateUserDto.username,
          id: id,
        },
      )
      .getOne();
    if (conflictingUser) {
      throw new ConflictException(
        'Username or email already in use by another user',
      );
    }
  }

  private async validateCreateUser(user: CreateUserDto) {
    const existingUser = await this.repository
      .createQueryBuilder('user')
      .where('user.email = :email OR user.username = :username', {
        email: user.email,
        username: user.username,
      })
      .getOne();
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    this.validatePassword(user.password, user.confirmPassword);
  }

  private validatePassword(password: string, confirmPassword: string) {
    if (password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
  }
}
