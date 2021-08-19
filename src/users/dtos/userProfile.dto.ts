import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class UserProfileInput {
  @Field(() => Number)
  id: number;
}
