import { Field, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class CoreEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Number)
  id: number;

  @CreateDateColumn()
  @Field(type => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(type => Date)
  updated_at: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}

@ObjectType()
export class CoreOutput {
  @Field(type => Boolean)
  ok: boolean;

  @Field(type => String, { nullable: true })
  error?: string;

  @Field(type => String, { nullable: true })
  message?: string;
}
