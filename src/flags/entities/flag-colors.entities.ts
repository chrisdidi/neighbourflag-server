import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/dtos/common.dto';
import { Column, Entity, OneToMany } from 'typeorm';
import { Flags } from './flags.entities';

export enum FormType {
  Supplies = 'Supplies',
  Job = 'Job',
}
registerEnumType(FormType, { name: 'FormType' });

@InputType('FlagColorsType', { isAbstract: true })
@ObjectType()
@Entity()
export class FlagColors extends CoreEntity {
  @Column()
  @Field(() => String)
  name?: string;

  @Column()
  @Field(() => String, { nullable: true })
  description?: string;

  @Column()
  @Field(() => String, { nullable: true })
  flagColor?: string;

  @Field(() => [Flags])
  @OneToMany(
    () => Flags,
    flags => flags.color,
  )
  flags: Flags[];

  @Column({ type: 'enum', enum: FormType, default: FormType.Supplies })
  @Field(() => FormType)
  formType?: FormType;

  @Column({ default: true })
  @Field(() => Boolean)
  on?: boolean;
}
