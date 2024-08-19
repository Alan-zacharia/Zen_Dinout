import nodemailer , { Transporter , SendMailOptions } from "nodemailer"
import configuredKeys from "../../configs/envConfig";


class  EmailService {
    private transporter : Transporter;
    constructor(){
      this.transporter = nodemailer.createTransport({
        service : "Gmail",
        auth :{
            user : configuredKeys.EMAIL,
            pass : configuredKeys.MAILER_PASS_KEY
        }
      });
    }
    private async sendMail(options : SendMailOptions) : Promise<{success : boolean}>{
        try{
          const info = await this.transporter.sendMail(options);
          console.log("Email sent: ", info.response);
          return {success : true};
        }catch(error){
            console.error("Error sending email: ", error);
            return { success: false };
        }
    }
    public async sendOtpEmail(email: string, otp: number): Promise<{ success: boolean }> {
        const htmlContent = `
          <p>Dear User,</p>
          <p>Thank you for using our service. As requested, here is your One-Time Password:</p>
          <h2 style="color: green;"><strong>${otp}</strong></h2>
          <p>Please use this OTP within the specified time limit to complete your authentication. Do not share this OTP with anyone, as it is valid for a single use only.</p>
          <p>If you did not request this OTP or have any concerns, please contact our support team immediately.</p>
          <p>Thank you,</p>
          <p>Zen Dinout</p>
        `;
    
        return this.sendMail({
          from: configuredKeys.EMAIL,
          to: email,
          subject: 'Zen-Dinout Verification code.',
          html: htmlContent,
        });
      }
    
      public async sendRegistrationConfirmationEmail(email: string): Promise<{ success: boolean }> {
        const htmlContent = `
          <p>Your registration on Zen-Dinout is completed. Please wait for the confirmation.</p>
        `;
    
        return this.sendMail({
          from: configuredKeys.EMAIL,
          to: email,
          subject: 'Zen-Dinout Registration Confirmation',
          html: htmlContent,
        });
      }

      public async sendReminderEmail(email: string, subject: string, content: string): Promise<{ success: boolean }> {
        return this.sendMail({
          from: configuredKeys.EMAIL,
          to: email,
          subject: subject,
          text: content,
        });
      }
}

export default new EmailService();