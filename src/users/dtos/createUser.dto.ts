import { ArgsType, Field, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ArgsType()
export class CreateUserInput extends PickType(User, [
  'email',
  'password',
  'role',
]) {
  @Field(() => String)
  password: string;
}
