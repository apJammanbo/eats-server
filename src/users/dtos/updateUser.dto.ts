import { ArgsType, Field, PartialType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ArgsType()
export class UpdateUserInput extends PartialType(
  PickType(User, ['email', 'role']),
) {}

@ArgsType()
export class UpdateUserPasswordInput extends PickType(User, ['password']) {
  @Field()
  password: string;
}
