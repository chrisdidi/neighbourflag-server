import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/common.dto';
import { AllowedAuthType, UserRole, Users } from '../entities/user.entities';

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

  @Field(type => Boolean)
  emailVerified: boolean;

  @Field(type => Date)
  createdAt: Date;

  @Field(type => String, { nullable: true })
  profile_picture?: string;

  @Field(type => String, { nullable: true })
  contact_no?: string;

  @Field(type => UserRole)
  role: UserRole;

  @Field(type => String)
  active: boolean;

  @Field(type => AllowedAuthType)
  authType: AllowedAuthType;
}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {
  @Field(type => BasicUserInfo, { nullable: true })
  user?: BasicUserInfo;

  @Field(type => String, { nullable: true })
  accessToken?: string;
}
