import { DynamicModule, Global, Module } from '@nestjs/common';
import { MAIL_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './mail.interface';
import { MailService } from './mail.service';

@Module({})
@Global()
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      providers: [
        {
          provide: MAIL_OPTIONS,
          useValue: options,
        },
        MailService,
      ],
      exports: [MailService],
    };
  }
}
