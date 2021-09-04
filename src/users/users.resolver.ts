import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/authUser.decorator';
import {
  CreateUserInput,
  LoginArgs,
  UpdateUserArgs,
  UpdateUserPasswordArgs,
} from './dtos/user.dto';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args() createUserInput: CreateUserInput): Promise<User> {
    return this.userService.createUser(createUserInput);
  }

  @Query(() => String)
  Login(@Args() loginArgs: LoginArgs): Promise<string> {
    return this.userService.login(loginArgs);
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() user: User): User {
    return user;
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  user(@Args('id') id: number): Promise<User> {
    return this.userService.getUser(id);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  updateUser(
    @AuthUser() user: User,
    @Args() updateUserArgs: UpdateUserArgs,
  ): Promise<User> {
    return this.userService.updateUser(user.id, updateUserArgs);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  updateUserPassword(
    @AuthUser() user: User,
    @Args() updateUserPasswordArgs: UpdateUserPasswordArgs,
  ): Promise<User> {
    return this.userService.updateUserPassword(user.id, updateUserPasswordArgs);
  }

  @Mutation(() => Boolean)
  verifyEmail(@Args('code') code: string): Promise<boolean> {
    return this.userService.verifyEmail(code);
  }
}
