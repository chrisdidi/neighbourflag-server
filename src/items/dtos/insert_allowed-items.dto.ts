import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/common.dto';
import { AllowedItems } from '../entities/allowed-items.entities';

@InputType()
export class InsertAllowedItemsInput extends PickType(AllowedItems, [
  'name',
  'popularity',
]) {}

@ObjectType()
export class InsertAllowedItemsOutput extends CoreOutput {}
