export interface EmailContent {
  from: string;
  to: string;
  template: string;
  subject: string;
  text: string;
  'v:username': string;
  'v:code': string;
}
