import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mailgun from 'mailgun-js';
import { EmailContent } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {
    // this.sendEmail({
    //   from: `9oclock <apjammanbo@9oclock.com>`,
    //   to: `apjammanbo@gmail.com`,
    //   template: 'confirm',
    //   subject: 'Hi Jammanbo',
    //   text: 'this is Text',
    //   'v:username': 'Jammanbo',
    //   'v:code': 'This is Code',
    // });
  }

  sendEmail(emailContent: EmailContent) {
    const domain = this.configService.get('MAILGUN_DOMAIN_NAME');
    const apiKey = this.configService.get('MAILGUN_API_KEY');
    const mg = mailgun({ apiKey, domain });
    const data = emailContent;
    mg.messages().send(data, function (error, body) {
      if (error) {
        console.log(error);
      } else {
        console.log(body);
      }
    });
  }
}

// const mailgun = require("mailgun-js");
// const DOMAIN = 'YOUR_DOMAIN_NAME';
// const mg = mailgun({apiKey: api_key, domain: DOMAIN});
// const data = {
// 	from: 'Excited User <me@samples.mailgun.org>',
// 	to: 'bar@example.com, YOU@YOUR_DOMAIN_NAME',
// 	subject: 'Hello',
// 	text: 'Testing some Mailgun awesomness!'
// };
// mg.messages().send(data, function (error, body) {
// 	console.log(body);
// });
