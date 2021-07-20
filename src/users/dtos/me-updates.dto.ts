import { InputType, PickType } from '@nestjs/graphql';
import { Users } from '../entities/user.entities';

@InputType()
export class MeUpdatesInput extends PickType(Users, ['id']) {}
