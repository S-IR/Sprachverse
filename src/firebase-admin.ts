import * as admin from "firebase-admin";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { ActionCodeSettings } from "firebase/auth";

// const ejs = require("ejs");

const serviceAccount =
  require("../serviceAccountKey.json") as admin.ServiceAccount;
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
export default admin;

// export async function sendPasswordReset(
//   userEmail: string,
//   actionCodeSettings: ActionCodeSettings
// ) {
//   try {
//     const actionLink = await admin
//       .auth()
//       .generatePasswordResetLink(userEmail, actionCodeSettings);
//     const template = await ejs.renderFile("./emails/verify-email.ejs", {
//       actionLink,
//       randomNumber: Math.random(),
//     });
//     const SENDGRID_KEY = process.env.SENDGRID_SENDMAIL as string;
//     const VERIFIED_EMAIL = process.env.VERIFIED_SENDER as string;

//     sgMail.setApiKey(SENDGRID_KEY);
//     const message = {
//       from: {
//         name: "Custom verify",
//         email: VERIFIED_EMAIL,
//       },
//       to: userEmail,
//       subject: "Reset your password",
//       text: `Follow this link in order to reset your password.
//       \n\n${actionLink} \n\nIf this email wasn't intended for you feel free to delete it.`,
//       html: template,
//     };
//     return sgMail.send(message);
//   } catch (error) {
//     console.log("error at sendVerifcationEmail:", error.message);
//   }
// }
