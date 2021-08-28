import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@ArgsType()
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field(() => String)
  code: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
