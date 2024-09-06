const sgMail = require('@sendgrid/mail')
import { Injectable } from '@nestjs/common';
import { log } from 'console';
require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
@Injectable()
export class SendgridService {
    async sendEmail(data: { to: string, subject: string, html: string }) {
        try {
            const htmldata = 'iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOBSURBVO3BQa5bSQIDwWRB979yjhe94GwKeJD07XYzIv7CzD8OM+UwUw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPlMFMOM+UwUw4z5cWbkvCTVJ5IwhMqTyShqbQk/CSVdxxmymGmHGbKiw9T+aQkfJJKS0JLQlNpSWgqT6h8UhI+6TBTDjPlMFNefFkSnlB5IglN5QmVmyQ0lZaEpvJEEp5Q+abDTDnMlMNMeTH/JwlPqPxNDjPlMFMOM+XFX07lJgk3Kv8lh5lymCmHmfLiy1R+UhKaSkvCE0l4QuUJlT/JYaYcZsphprz4sCT8TiotCU2lJaGptCQ0lZaEJ5LwJzvMlMNMOcyUF29S+ZOpfJPKjcq/yWGmHGbKYaa8eFMSmkpLwiepNJWWhKbSktBUWhI+KQmfpPJNh5lymCmHmRJ/4YOS0FRaEm5UbpLQVD4pCU3lJglN5SYJTeWJJDSVTzrMlMNMOcyUF7+ZSkvCjcoTSXhCpSXhHUloKi0JNyo3SWgq7zjMlMNMOcyUF1+WhKZyo/KOJDSVmyQ8odKS0JJwk4Sm8oRKS8InHWbKYaYcZsqL3ywJn6TSktBUmsqNyo1KS8KNSktCU2lJ+EmHmXKYKYeZ8uJNSbhReULlJglNpSWhqdwk4UblJglN5SYJTaUloam0JDSVTzrMlMNMOcyUFx+m0pLwRBJuVJ5IQlNpKi0JLQnvSMJNEt6RhKbyjsNMOcyUw0x58YdRuUlCU2kqLQk3SbhRuUlCS0JTaUm4UblRaUn4pMNMOcyUw0x58WUqTyThRuWbVFoSmsoTSXhHEppKU/mkw0w5zJTDTIm/8C+WhCdU3pGEG5UnknCj8pMOM+UwUw4z5cWbkvCTVJrKTRJaEm5UblRaEm6S0FRuVFoSnlB5x2GmHGbKYaa8+DCVT0rCTRJuVFoSmspNEprKEypPJKGp3CThkw4z5TBTDjPlxZcl4QmVP4lKS8JNEt6h0pLwkw4z5TBTDjPlxX+MSkvCT1JpSWhJ+J0OM+UwUw4z5cVfLglNpam0JDyh8g6VloQblZaETzrMlMNMOcyUF1+m8k0q70jCjUpLQkvCN6n8pMNMOcyUw0x58WFJ+ElJeELlRqUloancJOGTkvCTDjPlMFMOMyX+wsw/DjPlMFMOM+UwUw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPlMFMOM+V/3lN/I6tMfl8AAAAASUVORK5CYII='
            let message = {
                personalizations: [
                    {
                        to: [
                            {
                                email: "thibbatz@gmail.com"
                            }
                        ]
                    }
                ],
                from: {
                    email: "info@tufebum.xyz",
                    name: "kasun"
                },
                replyTo: {
                    email: "info@tufebum.xyz"
                },
                attachments: [{
                    content: htmldata,
                    filename: "qr.png",
                }],
                subject: "qr code",
                headers: { 'Message-ID': '123liyugt789thjky68yuww' },
                content: [
                    {
                        type: 'text/html',
                        value: htmldata
                    }
                ],
            }
            const msg = {
                to: data.to, // Change to your recipient
                from: "info@tufebum.xyz",
                subject: data.subject,
                html: htmldata,
            }
            await sgMail.send(message)
            log("email sent")
        }
        catch (error) {
            console.log(error)
        }
    }
}