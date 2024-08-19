export interface IMailer {
    sendMail(email : string ):Promise<{otp : number  | null; success : boolean}> 
}