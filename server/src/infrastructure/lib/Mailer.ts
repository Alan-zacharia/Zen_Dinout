import { IMailer } from "../../domain/interface/external-lib/IMailer";
import nodemailerCreateOtp from "../../functions/MailerGenrator";
import { otpGenerator } from "../../functions/OtpSetup";



export class MailerImpl implements IMailer{
   async sendMail(email: string): Promise<{ otp: number | null; success: boolean; }> {
       const otp =  otpGenerator.generateOtp()
       const result = await nodemailerCreateOtp(email , otp);
       return{otp , success: result.success}
    }
}