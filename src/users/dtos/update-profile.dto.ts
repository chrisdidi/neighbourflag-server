import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/common.dto';
import { Users } from '../entities/user.entities';

@InputType()
export class UpdateProfileInput extends PickType(PartialType(Users), [
  'email',
  'name',
  'contact_no',
]) {}

@ObjectType()
export class UpdateProfileOutput extends CoreOutput {}
