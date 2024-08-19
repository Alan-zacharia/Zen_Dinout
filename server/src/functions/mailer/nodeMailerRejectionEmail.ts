import nodemailer from 'nodemailer';

const nodeMailerRejectionEmail = async(email:string , rejectReason :string) : Promise <{success : boolean}> =>{

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
  html:`<p>Dear Restaurant,</p>
  <p>As requested, your restaurant request has been rejected.</p>
  <p>Reason : ${rejectReason}</p>
  <p>If you did not request this or have any concerns, please contact our support team immediately.</p>
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

export default nodeMailerRejectionEmail;


