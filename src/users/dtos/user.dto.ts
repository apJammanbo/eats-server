import {
  ArgsType,
  Field,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ArgsType()
export class CreateUserInput extends OmitType(User, [
  'id',
  'createdAt',
  'updatedAt',
]) {}

@ArgsType()
export class LoginInput extends PickType(User, ['email', 'password']) {
  @Field(() => String)
  password: string;
}

@ArgsType()
export class UpdateUserInput extends PartialType(
  PickType(User, ['email', 'role']),
) {}

@ArgsType()
export class UpdateUserPasswordInput extends PickType(User, ['password']) {
  @Field()
  password: string;
}
