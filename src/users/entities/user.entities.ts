import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/dtos/common.dto';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

export enum UserRole {
  User = 'User',
  Admin = 'Admin',
  External = 'External',
}

export enum AllowedAuthType {
  google = 'google',
  email = 'email',
}
registerEnumType(UserRole, { name: 'UserRole' });
registerEnumType(AllowedAuthType, { name: 'AllowedAuthType' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Users extends CoreEntity {
  @Column({ unique: true })
  @Field(type => String)
  email: string;

  @Column({ select: false, nullable: true })
  @Field(type => String, { nullable: true })
  password?: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  name?: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  profile_picture?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  @Field(type => UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field(type => Boolean)
  emailVerified: boolean;

  @Column({ default: true })
  @Field(type => Boolean)
  active: boolean;

  @Column({
    type: 'enum',
    enum: AllowedAuthType,
    default: AllowedAuthType.email,
  })
  @Field(type => AllowedAuthType)
  authType: AllowedAuthType;

  @BeforeInsert()
  @BeforeUpdate()
  async insertOrUpdateEmail(): Promise<void> {
    if (this.email) {
      this.email = this.email.toLowerCase();
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  async updatePassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(aPassword, this.password);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
