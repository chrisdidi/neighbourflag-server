import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/common.dto';
import { FlagColors } from '../entities/flag-colors.entities';

@ObjectType()
export class FindFlagColorsOutput extends CoreOutput {
  @Field(type => [FlagColors])
  flagColors: FlagColors[];
}
