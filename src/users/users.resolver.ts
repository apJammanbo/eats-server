import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/authUser.decorator';
import {
  CreateUserInput,
  LoginInput,
  UpdateUserInput,
  UpdateUserPasswordInput,
} from './dtos/user.dto';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args() createUserInput: CreateUserInput): Promise<User> {
    return await this.userService.createUser(createUserInput);
  }

  @Query(() => String)
  Login(@Args() loginInput: LoginInput): Promise<string> {
    return this.userService.login(loginInput);
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() user: User): User {
    return user;
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  async user(@Args('id') id: number): Promise<User> {
    return await this.userService.getUser(id);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async updateUser(
    @AuthUser() user: User,
    @Args() updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return await this.userService.updateUser(user.id, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async updateUserPassword(
    @AuthUser() user: User,
    @Args() updateUserPasswordInput: UpdateUserPasswordInput,
  ): Promise<User> {
    return await this.userService.updateUserPassword(
      user.id,
      updateUserPasswordInput,
    );
  }
}
