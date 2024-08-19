import nodemailer from 'nodemailer';

const nodemailerCreateOtp = async(email:string , otp : number) : Promise <{success : boolean}> =>{

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'alanzacaharia@gmail.com',
    pass: 'awbz hfsp nlnu grwt',
  }
});

const mailOptions: nodemailer.SendMailOptions = {
  from: 'alanzacaharia@gmail.com',
  to: `${email}`,
  subject: "Zen-Dinout",
//   html:`<p>To complete your booking registration on Zen-Dinout, please use the following One-Time Password </p> <br> <b>${otp}</b>`,
  html:`<p>Dear User,</p>
  <p>Thank you for using our service. As requested, here is your One-Time Password:</p>
  <h2 style="color : green"><strong>${otp}</strong></h2>
  <p>Please use this OTP within the specified time limit to complete your authentication. Do not share this OTP with anyone, as it is valid for a single use only.</p>
  <p>If you did not request this OTP or have any concerns, please contact our support team immediately.</p>
  <p>Thank you,</p>
  <p>Zen Dinout</p>`,
};

try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return { success: true };
} catch (error) {
    console.error("Error sending email: ", error);
    return { success: false };
}

}

export default nodemailerCreateOtp;


