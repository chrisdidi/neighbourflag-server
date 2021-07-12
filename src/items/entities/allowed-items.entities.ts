import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/dtos/common.dto';
import { Column, Entity } from 'typeorm';

@InputType('AllowedItemsInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class AllowedItems extends CoreEntity {
  @Column()
  @Field()
  name: string;

  @Column({ default: 0 })
  @Field(type => Number)
  popularity: number;

  @Column({ default: true })
  @Field(type => Boolean)
  show: boolean;

  @Column()
  @Field(type => String)
  code: string;
}
