import { Field, ArgsType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/outputDto';
import { User } from '../entities/user.entity';

@ArgsType()
export class LoginInput extends PickType(User, ['email', 'password']) {
  @Field(() => String)
  password: string;
}

@ObjectType()
export class LogginOutput extends CoreOutput {
  @Field(() => String, { nullable: true })
  token?: string;
}
