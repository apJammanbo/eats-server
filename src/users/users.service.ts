import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import UserError, { USER_ERROR } from './processError';
import { JwtService } from '../jwt/jwt.service';
import {
  CreateUserInput,
  LoginArgs,
  UpdateUserArgs,
  UpdateUserPasswordArgs,
} from './dtos/user.dto';
import { Verification } from './entities/verification.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // Create User
  createUser = async (createUserInput: CreateUserInput): Promise<User> => {
    const existUser = await this.users.findOne({
      where: { email: createUserInput.email },
    });
    if (existUser) {
      throw new UserError(USER_ERROR.ALREADY_EXIST_EMAIL);
    }

    const user = await this.users.save(this.users.create(createUserInput));
    const verification = await this.verifications.save(
      this.verifications.create({
        user,
      }),
    );
    this.mailService.sendEmail({
      from: `9oclock <apjammanbo@9oclock.com>`,
      to: user.email,
      template: 'confirm',
      subject: `Hi ${user.name}`,
      text: 'this is Text',
      'v:username': `${user.name}`,
      'v:code': `${verification.code}`,
    });
    return user;
  };

  // Login
  async login({ email, password }: LoginArgs): Promise<string> {
    const user = await this.users.findOne(
      { email },
      { select: ['id', 'password'] },
    );
    if (!user) {
      throw new UserError(USER_ERROR.USER_NOT_FOUND);
    } else if (!user.verified) {
      throw new UserError(USER_ERROR.NO_VERIFICATION_FOUND);
    } else {
      const isLogin = user.checkPassword(password);
      if (!isLogin) {
        throw new UserError(USER_ERROR.PASSWORD_NOT_CORRECT);
      }
      const token = this.jwtService.sign({ id: user.id });
      return token;
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
  async updateUser(id: number, UpdateUserArgs: UpdateUserArgs): Promise<User> {
    const user = await this.getUser(id);
    const updatedUser = new User({ ...user, ...UpdateUserArgs });
    if (UpdateUserArgs.email) {
      UpdateUserArgs.verified = false;
      const verification = await this.verifications.findOne({ user });
      if (verification) {
        await this.verifications.remove(verification);
      }
      await this.verifications.save(this.verifications.create({ user }));
      this.mailService.sendEmail({
        from: `9oclock <apjammanbo@9oclock.com>`,
        to: user.email,
        template: 'confirm',
        subject: `Hi ${user.name}`,
        text: 'this is Text',
        'v:username': `${user.name}`,
        'v:code': `${verification.code}`,
      });
      return user;
    }
    await this.users.save(updatedUser);
    return await this.getUser(id);
  }

  // update password
  async updateUserPassword(
    id: number,
    { password }: UpdateUserPasswordArgs,
  ): Promise<User> {
    const user = await this.getUser(id);
    user.password = password;
    await user.hashPassword();
    return await this.users.save(user);
  }

  // verifyEmail
  async verifyEmail(code: string): Promise<boolean> {
    const verification = await this.verifications.findOne(
      { code },
      { relations: ['user'] },
    );
    if (verification) {
      verification.user.verified = true;
      await this.users.save(verification.user);
      await this.verifications.remove(verification);
      return true;
    }
    return false;
  }
}
