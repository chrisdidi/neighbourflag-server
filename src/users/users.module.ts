import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entities';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { MailModule } from 'src/mail/mail.module';
import { Verification } from './entities/verification.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Verification]), MailModule],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
