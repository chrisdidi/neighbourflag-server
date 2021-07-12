import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/dtos/common.dto';
import { Column, Entity, ManyToOne } from 'typeorm';
import { FlagColors } from './flag-colors.entities';

export enum FlagsUIType {
  Supplies = 'Supplies',
  FindJobs = 'FindJobs',
  PetAdopt = 'PetAdopt',
}

registerEnumType(FlagsUIType, { name: 'FlagsUIType' });

@InputType('FlagsSupportedTypesType', { isAbstract: true })
@ObjectType()
@Entity()
export class FlagsSupportedTypes extends CoreEntity {
  @Column()
  @Field(() => String)
  name?: string;

  @Column()
  @Field(() => String)
  description?: string;

  @Column({ default: true })
  @Field(() => Boolean)
  isOn: boolean;

  @Column({
    type: 'enum',
    enum: FlagsUIType,
    default: FlagsUIType.Supplies,
  })
  @Field(type => FlagsUIType)
  uiType: FlagsUIType;
}
