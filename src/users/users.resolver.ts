import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/authUser.decorator';
import { CoreOutput } from 'src/common/dtos/outputDto';
import { CreateUserInput } from './dtos/createUser.dto';
import {
  UpdateUserInput,
  UpdateUserPasswordInput,
} from './dtos/updateUser.dto';
import { LogginOutput, LoginInput } from './dtos/login.dto';
import { UserProfileInput } from './dtos/userProfile.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => CoreOutput)
  createUser(@Args() createUserInput: CreateUserInput): Promise<CoreOutput> {
    return this.userService.createUser(createUserInput);
  }

  @Query(() => LogginOutput)
  Login(@Args() loginInput: LoginInput): Promise<LogginOutput> {
    return this.userService.login(loginInput);
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() user: User): User {
    return user;
  }

  @Query(() => User, { nullable: true })
  @UseGuards(AuthGuard)
  async user(@Args() userProfileInput: UserProfileInput): Promise<User> | null {
    const user = await this.userService.getUser(userProfileInput.id);
    return user;
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async updateUser(
    @AuthUser() user: User,
    @Args() updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return await this.userService.updateUser(user.id, updateUserInput);
  }

  @Mutation(() => CoreOutput)
  @UseGuards(AuthGuard)
  async updateUserPassword(
    @AuthUser() user: User,
    @Args() updateUserPasswordInput: UpdateUserPasswordInput,
  ): Promise<CoreOutput> {
    return await this.userService.updateUserPassword(
      user.id,
      updateUserPasswordInput,
    );
  }
}
