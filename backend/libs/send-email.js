// import sgMail from "@sendgrid/mail";
// import dotenv from "dotenv";

// dotenv.config();

// sgMail.setApiKey(process.env.SEND_GRID_API);

// const fromEmail = process.env.FROM_EMAIL;

// export const sendEmail = async (to, subject, html) => {
//   const msg = {
//     to,
//     from: `TaskHub <${fromEmail}>`,
//     subject,
//     html,
//   };

//   try {
//     await sgMail.send(msg);
//     console.log("Email sent successfully");

//     return true;
//   } catch (error) {
//     console.error("Error sending email:", error);

//     return false;
//   }
// };



// import sgMail from "@sendgrid/mail";
import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from "dotenv";

dotenv.config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const senderConfig = {
  email: 'manjeetkumar1572000@gmail.com',
  name: "Kakarot"
}

export const sendEmail = async (email, emailSubject, emailBody) => {
  await apiInstance.sendTransacEmail({
    sender: senderConfig,
    to: [{ email }],
    subject: emailSubject,
    htmlContent: emailBody
  });
};

