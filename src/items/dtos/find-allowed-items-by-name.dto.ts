import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/common.dto';
import { AllowedItems } from '../entities/allowed-items.entities';

@InputType()
export class FindAllowedItemsByNameInput {
  @Field(type => String)
  queryText: string;

  @Field(type => Number)
  page: number;

  @Field(type => Number)
  limit: number;
}

@ObjectType()
export class FindAllowedItemsByNameOutput extends CoreOutput {
  @Field(type => [AllowedItems], { nullable: true })
  allowedItems?: AllowedItems[];
}
