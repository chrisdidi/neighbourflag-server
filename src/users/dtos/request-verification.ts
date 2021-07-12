import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/common.dto';
import { Users } from '../entities/user.entities';

@InputType()
export class RequestVerificationInput extends PickType(Users, ['email']) {}

@ObjectType()
export class RequestVerificationOuput extends CoreOutput {}
