import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/common.dto';
import { Users } from '../entities/user.entities';

@InputType()
export class CreateAccountInput extends PickType(Users, [
  'email',
  'name',
  'password',
]) {}

@ObjectType()
export class BasicUserInfo {
  @Field(type => Number)
  id: number;

  @Field(type => String)
  email: string;

  @Field(type => String)
  name: string;
}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {
  @Field(type => BasicUserInfo, { nullable: true })
  user?: BasicUserInfo;

  @Field(type => String, { nullable: true })
  accessToken?: string;
}
