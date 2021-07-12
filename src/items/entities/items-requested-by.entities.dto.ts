import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/dtos/common.dto';
import { Column, Entity } from 'typeorm';

@InputType('ItemsRequestBy', { isAbstract: true })
@ObjectType()
@Entity()
export class ItemsRequestBy extends CoreEntity {
  @Column()
  @Field()
  userId: number;

  @Column()
  @Field(type => Number)
  requestItemId: number;
}
