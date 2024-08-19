import nodemailer from 'nodemailer';

const nodeMailerConfirmationEmail = async(email:string ) : Promise <{success : boolean}> =>{

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
  <p>Thank you for using our service. As requested , your restaurant is confirmed</p>
  <h2 style="color : green"><strong><a href='http://localhost:4000/login'>Login Your account</a></strong></h2>
  <p>If you did not request have any concerns, please contact our support team immediately.</p>
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

export default nodeMailerConfirmationEmail;


