import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entities';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { MailModule } from 'src/mail/mail.module';
import { Verification } from './entities/verification.entities';
import { UsersModuleOptions } from './users.interface';
import { USER_OPTIONS } from 'src/common/common.constants';

@Module({})
@Global()
export class UsersModule {
  static forRoot(options: UsersModuleOptions): DynamicModule {
    return {
      module: UsersModule,
      imports: [TypeOrmModule.forFeature([Users, Verification]), MailModule],
      providers: [
        {
          provide: USER_OPTIONS,
          useValue: options,
        },
        UsersService,
        UsersResolver,
      ],
      exports: [UsersService],
    };
  }
}
