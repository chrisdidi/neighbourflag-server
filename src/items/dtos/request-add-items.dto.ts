import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/common.dto';

@InputType()
export class RequestAddItemsInput {
  @Field(() => [String])
  items: string[];
}

@ObjectType()
export class RequestAddItemsOutput extends CoreOutput {}
