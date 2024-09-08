const sgMail = require('@sendgrid/mail')
import { Body, Injectable } from '@nestjs/common';
import { log } from 'console';
require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
@Injectable()
export class SendgridService {
    async sendEmail(data: { to: string, code: string, body: string }): Promise<void> {
        try {
            let message = {
                personalizations: [
                    {
                        to: [
                            {
                                email: data.to
                            }
                        ]
                    }
                ],
                from: {
                    email: "info@tufebum.xyz",
                    name: "Ticket System"
                },
                replyTo: {
                    email: "info@tufebum.xyz"
                },
                attachments: [{
                    content: data.code,
                    filename: "ticket.png",
                }],
                subject: "qr code Notification",
                // headers: { 'Message-ID': '123liyugt789thjky68yuww' },
                content: [
                    {
                        type: 'text/html',
                        value: data.body
                    }
                ],
            }
            await sgMail.send(message)
            log("email sent")
        }
        catch (error) {
            throw new Error(error)
        }
    }
}