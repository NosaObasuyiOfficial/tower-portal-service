import { Resend } from "resend";
import dotenv from 'dotenv'
import { buildAdmissionNotificationEmail } from "./mailMessage";

dotenv.config()

// const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, DEV_GMAIL_USER, DEV_GMAIL_PASSWORD, ADMISSIONS_INBOX, PORTAL_WEB_URL } = process.env


/* =============================================================================
   Sends the "new application" notification to the Tower Admissions inbox via
   Resend's HTTP API.

   IMPORTANT: this deliberately does NOT use raw SMTP (nodemailer + smtp.gmail.com).
   Render blocks outbound SMTP connections (ports 25/465/587) at the network
   level on their infrastructure, so any SMTP transport hangs until it hits
   nodemailer's connection timeout (ETIMEDOUT on CONN) — no combination of
   credentials, ports, or App Passwords fixes that, because the TCP connection
   never leaves Render's network in the first place. Resend sends over normal
   HTTPS (443), which isn't blocked.
   ============================================================================= */

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMISSIONS_INBOX = process.env.TOWER_ADMISSIONS_EMAIL as string; // e.g. toweradmissionscentre@gmail.com
const ADMIN_BASE_URL = process.env.TOWER_ADMIN_BASE_URL as string; // e.g. https://admin.towerprep.edu
// Must be an address on a domain you've verified in the Resend dashboard
// (Domains -> Add Domain -> add the SPF/DKIM DNS records they give you).
// Until a domain is verified, Resend only lets you send to the email address
// you signed up with — fine for testing, not for real applicant traffic.
const FROM_ADDRESS = process.env.RESEND_FROM_ADDRESS as string; // e.g. "Tower Preparatory Academy <admissions@towerprep.edu>"

export async function sendAdmissionNotification(params: {
  data: any;
  applicationId: string;
  submittedAt?: Date;
}) {
  const { data, applicationId, submittedAt } = params;

  const reviewUrl = `${ADMIN_BASE_URL}/${applicationId}`;

  const { subject, html, text } = buildAdmissionNotificationEmail({
    data,
    applicationId,
    reviewUrl,
    submittedAt,
  });

  const { data: sendResult, error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: ADMISSIONS_INBOX,
    subject,
    html,
    text,
  });

  if (error) {
    // Resend returns a structured error rather than throwing — surface it
    // the same way a thrown error would behave for callers/try-catch upstream.
    console.error("sendAdmissionNotification failed:", error);
    throw new Error(`Failed to send admission notification: ${error.message}`);
  }

  return sendResult;
}






// const transporter = nodemailer.createTransport({
//  host: SMTP_HOST!,
//   port: Number(SMTP_PORT ?? 587),
//   secure: SMTP_SECURE! === "true",
//     auth: {
//     user: DEV_GMAIL_USER!,
//     pass: DEV_GMAIL_PASSWORD!,
//   },
// });

// console.log(transporter)

// export async function sendAdmissionNotification(params: {
//   data: any;
//   applicationId: string;
//   submittedAt?: Date;
// }) {
//   const { data, applicationId, submittedAt } = params;

//   console.log("params", params)


//   const reviewUrl = `${PORTAL_WEB_URL}/${applicationId}` || "https://www.towerpreparatoryacademy.com";

//   const { subject, html, text } = buildAdmissionNotificationEmail({
//     data,
//     applicationId,
//     reviewUrl,
//     submittedAt,
//   });

//   await transporter.sendMail({
//     from: `"Tower Preparatory Academy" <${process.env.DEV_GMAIL_USER}>`,
//     to: ADMISSIONS_INBOX!,
//     subject,
//     html,
//     text,
//   });
// };


// const { DEV_GMAIL_USER, DEV_GMAIL_PASSWORD } = process.env
// export const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth:{
//         user: DEV_GMAIL_USER!,
//         pass: DEV_GMAIL_PASSWORD!
//     },
//     tls:{
//         rejectUnauthorized: false
//     }
// })

// export const sendmail = async(from:string, to:string, subject:string, html:string)=>{
//     try{
//          await transporter.sendMail({
//             from,
//             to,
//             subject,
//             html,
//         })
//     }catch(err){
//         console.log(err)
//     }
// }

// export const emailHtmlForUser = ()=>{
//     const mail = `
// <head>
//     <style>
//         body {
//             font-family: Arial, sans-serif;
//             line-height: 1.6;
//             color: #333;
//             margin: 0;
//             padding: 0;
//         }
//         .email-container {
//             width: 100%;
//             max-width: 600px;
//             margin: 0 auto;
//             border: 1px solid #ddd;
//             border-radius: 8px;
//             overflow: hidden;
//             box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//         }
//         .header {
//             background-color: #275C5E;
//             color: white;
//             text-align: center;
//             padding: 20px 10px;
//         }
//         .header img {
//             max-width: 150px;
//             height: auto;
//         }
//         .content {
//             padding: 20px;
//             text-align: justify;
//         }
//         .button {
//             display: inline-block;
//             background-color: #275C5E;
//             color: white;
//             text-decoration: none;
//             padding: 10px 20px;
//             border-radius: 5px;
//             margin: 10px 0;
//             font-size: 16px;
//         }
//         .footer {
//             text-align: center;
//             font-size: 14px;
//             padding: 15px;
//             background-color: #f9f9f9;
//             color: #888;
//         }
//         .footer span {
//             color: #275C5E;
//             font-weight: bold;
//         }
//         a {
//             color: #275C5E;
//             text-decoration: none;
//         }
//         .note {
//             font-size: 12px;
//             color: #666;
//             text-align: center;
//             margin-top: 10px;
//         }
//     </style>
// </head>
// <body>
//     <div class="email-container">
//         <div class="header">
//             <img src="https://i.imgur.com/DYnK8Qi.png" alt="Pr and Marketing Solutions Logo">
//             <h1>Thank You for Subscribing!</h1>
//         </div>
//         <div class="content">
//             <h4>Welcome,</h4>
//             <p>We’re thrilled to have you as part of our growing community at <strong>The Link PR and Marketing Solutions</strong>! Thank you for subscribing to stay connected with us.</p>
//             <p>We’ll be sure to keep you updated and will alert you the moment our site goes live. Exciting things are coming, and we can’t wait for you to see them!</p>
//             <p>In the meantime, if you have any questions or suggestions, feel free to reach out to us. Your feedback helps us grow and improve!</p>
//             <a href="mailto:thelinkprandmarketingsolutions@gmail.com" class="button">Contact Us</a>
//         </div>
//         <div class="footer">
//             <p>Thank you for your support! We’re excited to take this journey with you.</p>
//             <p>Powered by <span>The Link PR and Marketing Solutions</span></p>
//         </div>
//         <div class="note">
//             <p>Please do not reply to this email, as it is a system-generated message.</p>
//         </div>
//     </div>
// </body>`
//   return mail
// }
