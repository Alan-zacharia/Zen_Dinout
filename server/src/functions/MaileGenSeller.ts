import nodemailer from 'nodemailer';

const nodemaileMailSeller = async(email:string ) : Promise <{success : boolean}> =>{

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
  html:`<p>Your Registeration on Zen-Dinout is completed, wait for the comfirmation </p> <br> <b></b>`,
 
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

export default nodemaileMailSeller;


