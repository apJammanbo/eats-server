import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dtos/outputDto';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dtos/createUser.dto';
import { LogginOutput, LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import {
  UpdateUserInput,
  UpdateUserPasswordInput,
} from './dtos/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Create User
  async createUser({
    email,
    password,
    role,
  }: CreateUserInput): Promise<CoreOutput> {
    try {
      const existUser = await this.users.findOne({ email });
      if (existUser) {
        return {
          ok: false,
          error: '이미 사용중인 이메일입니다.',
        };
      }
      await this.users.save(this.users.create({ email, password, role }));
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error: e.message,
      };
    }
  }

  // Login
  async login({ email, password }: LoginInput): Promise<LogginOutput> {
    try {
      const user = await this.users.findOne(
        { email },
        { select: ['password'] },
      );
      if (!user) {
        return { ok: false, error: 'User not found!' };
      } else {
        const isLogin = user.checkPassword(password);
        if (!isLogin) {
          return { ok: false, error: 'password is not correct' };
        }
        const token = this.jwtService.sign({ id: user.id });
        return { ok: true, token };
      }
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  // Get User
  async getUser(id: number): Promise<User> {
    return await this.users.findOne({ id });
  }

  // update user
  async updateUser(
    id: number,
    updateUserInput: UpdateUserInput,
  ): Promise<User> {
    const user = await this.getUser(id);
    const updatedUser = new User({ ...user, ...updateUserInput });
    if (updateUserInput.password) {
      await updatedUser.hashPassword();
    }
    await this.users.save(updatedUser);
    return await this.getUser(id);
  }

  // update password
  async updateUserPassword(
    id: number,
    { password }: UpdateUserPasswordInput,
  ): Promise<CoreOutput> {
    const user = await this.getUser(id);
    const updatedUser = new User({ ...user, password });
    await updatedUser.hashPassword();
    await this.users.save(updatedUser);
    return {
      ok: true,
    };
  }
}
