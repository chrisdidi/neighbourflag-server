import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/dtos/common.dto';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Users } from './user.entities';
import { addMinutes, randomDigits } from '../../utils/algo';

@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field(type => String)
  code: string;

  @ManyToOne(type => Users, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: Users;

  @Column()
  @Field(type => Date)
  expire_at: Date;

  @BeforeInsert()
  createCode(): void {
    const code = randomDigits(6);
    this.code = code;
    this.expire_at = addMinutes(new Date(), 5);
  }
}
