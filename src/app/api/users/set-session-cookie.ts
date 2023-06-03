import { cookies } from "next/headers";
import { getCookies, getCookie, setCookie, deleteCookie } from "cookies-next";
import admin from "../../../firebase-admin";
import { getAuth } from "firebase/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("set-session-cookie reached");

  const idToken = req.body.token;
  if (!idToken) {
    res.status(401).send("UNAUTHORIZED REQUEST");
    return;
  }
  const sessionCookieExpiration = parseInt(
    process.env.NEXT_PUBLIC_sessionCookieExpiration as string
  );
  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn: sessionCookieExpiration })
    .then(
      (sessionCookie) => {
        // Set cookie policy for session cookie.
        const options = {
          req,
          res,
          maxAge: sessionCookieExpiration,
          httpOnly: true,
          secure: true,
        };
        setCookie("session", sessionCookie, options);
        res.status(200).json({ message: "Successfully set cookie!" });
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
}
