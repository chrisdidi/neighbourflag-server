export interface MailModuleOptions {
  apiKey: string;
  domain: string;
  fromEmail: string;
  helpEmail: string;
}

export interface EmailVar {
  key: string;
  value: string;
}

export interface EmailTemplate {
  from?: string;
  subject: string;
  email: string;
  template?: string;
  content?: string;
  emailVars?: EmailVar[];
}
