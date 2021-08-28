import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import UserError, { USER_ERROR } from './processError';
import { JwtService } from '../jwt/jwt.service';
import {
  CreateUserInput,
  LoginInput,
  UpdateUserInput,
  UpdateUserPasswordInput,
} from './dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Create User
  createUser = async (createUserInput: CreateUserInput): Promise<User> => {
    const existUser = await this.users.findOne({
      where: { email: createUserInput.email },
    });
    if (existUser) {
      throw new UserError(USER_ERROR.ALREADY_EXIST_EMAIL);
    }
    return await this.users.save(this.users.create(createUserInput));
  };

  // Login
  async login({ email, password }: LoginInput): Promise<string> {
    const user = await this.users.findOne({ email }, { select: ['password'] });
    if (!user) {
      throw new UserError(USER_ERROR.USER_NOT_FOUND);
    } else {
      const isLogin = user.checkPassword(password);
      if (!isLogin) {
        throw new UserError(USER_ERROR.PASSWORD_NOT_CORRECT);
      }
      return this.jwtService.sign({ id: user.id });
    }
  }

  // Get User
  async getUser(id: number): Promise<User> {
    const user = await this.users.findOne({ id });
    if (!user) {
      throw new UserError(USER_ERROR.USER_NOT_FOUND);
    }
    return user;
  }

  // update user
  async updateUser(
    id: number,
    updateUserInput: UpdateUserInput,
  ): Promise<User> {
    const user = await this.getUser(id);
    const updatedUser = new User({ ...user, ...updateUserInput });
    await this.users.save(updatedUser);
    return await this.getUser(id);
  }

  // update password
  async updateUserPassword(
    id: number,
    { password }: UpdateUserPasswordInput,
  ): Promise<User> {
    const user = await this.getUser(id);
    user.password = password;
    await user.hashPassword();
    return await this.users.save(user);
  }
}
