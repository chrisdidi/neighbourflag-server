import got from 'got';
import * as FormData from 'form-data';
import { Inject, Injectable } from '@nestjs/common';
import { MAIL_OPTIONS } from 'src/common/common.constants';
import { EmailTemplate, MailModuleOptions } from './mail.interface';

@Injectable()
export class MailService {
  constructor(
    @Inject(MAIL_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  async sendEmail({
    from = 'Chris from neighbourflag',
    subject,
    email,
    template,
    content,
    emailVars,
  }: EmailTemplate): Promise<boolean> {
    const form = new FormData();
    form.append('from', `${from} <noreply@${this.options.domain}>`);
    form.append('to', email);
    form.append('subject', subject);
    if (content) form.append('text', content);
    if (template) form.append('template', template);
    emailVars.forEach(eVar => form.append(`v:${eVar.key}`, eVar.value));
    try {
      await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: form,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail({
      from: 'neighbourflag | Account Created!',
      subject: 'E-mail verification',
      template: 'email-code',
      email,
      emailVars: [
        { key: 'contact_email', value: 'hi@neighbourflag.com' },
        {
          key: 'verification_code_button',
          value: `<a href="https://neighbourflag.com/email-verification?code=${code}" target="_blank" style="cursor:pointer; width:100%; border-style:none; border-radius:16px; font-weight:800; background-color:#EF6767">${code}</a>`,
        },
      ],
    });
  }
}
