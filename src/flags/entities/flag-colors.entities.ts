import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/dtos/common.dto';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { FlagsSupportedTypes } from './flags-supported-types.entities';
import { Flags } from './flags.entities';

@InputType('FlagColorsType', { isAbstract: true })
@ObjectType()
@Entity()
export class FlagColors extends CoreEntity {
  @Column()
  @Field(() => String)
  name?: string;

  @Column()
  @Field(() => String, { nullable: true })
  flagColor?: string;

  @Field(type => [FlagsSupportedTypes])
  @ManyToMany(type => FlagsSupportedTypes, { eager: true })
  @JoinTable()
  allowedFormTypes: FlagsSupportedTypes[];

  @Field(type => [Flags])
  @OneToMany(
    type => Flags,
    flags => flags.color,
  )
  flags: Flags[];
}
