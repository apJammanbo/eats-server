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
]) {
  @Field(() => String)
  password: string;
}

@ArgsType()
export class LoginArgs extends PickType(User, ['email', 'password']) {
  @Field(() => String)
  password: string;
}

@ArgsType()
export class UpdateUserArgs extends PartialType(
  PickType(User, ['email', 'role']),
) {}

@ArgsType()
export class UpdateUserPasswordArgs extends PickType(User, ['password']) {
  @Field()
  password: string;
}
