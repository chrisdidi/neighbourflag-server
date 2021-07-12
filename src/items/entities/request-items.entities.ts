import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/dtos/common.dto';
import { Column, Entity } from 'typeorm';

@InputType('RequestItems', { isAbstract: true })
@ObjectType()
@Entity()
export class RequestItems extends CoreEntity {
  @Column()
  @Field()
  name: string;

  @Column()
  @Field(type => String)
  code: string;

  @Column({ default: 0 })
  @Field(type => Number)
  requestCounts: number;
}
