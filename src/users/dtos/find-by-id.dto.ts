import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/common.dto';
import { Users } from '../entities/user.entities';

@InputType()
export class FindByIdInput extends PickType(Users, ['id']) {}

@ObjectType()
export class FindByIdOutput extends CoreOutput {
  @Field(type => Users, { nullable: true })
  user?: Users;
}
