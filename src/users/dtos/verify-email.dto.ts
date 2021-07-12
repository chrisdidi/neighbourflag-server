import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/common.dto';

@InputType()
export class VerifyEmailInput {
  @Field(type => String)
  email: string;

  @Field(type => String)
  code: string;
}

@ObjectType()
export class VerifyEmailOutput extends CoreOutput {}
