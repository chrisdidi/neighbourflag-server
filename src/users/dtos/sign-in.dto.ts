import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/common.dto';
import { Users } from '../entities/user.entities';

@InputType()
export class SignInInput extends PickType(Users, ['email', 'password']) {}

@ObjectType()
export class SignInOutput extends CoreOutput {
  @Field(type => String, { nullable: true })
  accessToken?: string;

  @Field(type => Number, { nullable: true })
  id?: number;
}
