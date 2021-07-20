import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/common.dto';
import { FlagColors } from '../entities/flag-colors.entities';

@InputType()
export class InsertFlagColorInput extends PickType(PartialType(FlagColors), [
  'description',
  'flagColor',
  'formType',
  'name',
  'on',
]) {}

@ObjectType()
export class InsertFlagColorOutput extends CoreOutput {}
