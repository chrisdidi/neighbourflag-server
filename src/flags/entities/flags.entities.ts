import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/dtos/common.dto';
import { Users } from 'src/users/entities/user.entities';
import { Column, Entity, ManyToOne } from 'typeorm';
import { FlagColors } from './flag-colors.entities';

@InputType('FlagsType', { isAbstract: true })
@ObjectType()
@Entity()
export class Flags extends CoreEntity {
  @Column()
  @Field(() => String)
  reason?: string;

  @Column()
  @Field(() => String)
  message?: string;

  @Column({ default: false })
  @Field(() => Boolean)
  blocked: boolean;

  @Field(() => Users)
  @ManyToOne(
    type => Users,
    user => user.flags,
  )
  raisedBy: Users;

  @Field(() => FlagColors)
  @ManyToOne(
    type => FlagColors,
    color => color.flags,
  )
  color: FlagColors;
}
