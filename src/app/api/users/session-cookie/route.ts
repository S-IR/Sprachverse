import { cookies, headers } from "next/headers";
import admin from "../../../../firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export async function GET(req: Request) {
  console.log("session cookie route reached");
  const headersInstance = headers();
  const authorization = headersInstance.get("Authorization");
  console.log("authorization", authorization);

  if (!authorization?.startsWith("Bearer")) {
    console.log("AUTHORIZATION DOES NOT START WITH BEARER AT session-cookie");

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const auth = admin.auth();

  const token = authorization.split(" ")[1];
  const sessionCookieExpiration = parseInt(
    process.env.FIREBASE_SESSION_EXPIRATION as string
  );

  const options = {
    maxAge: sessionCookieExpiration,
    httpOnly: true,
    secure: true,
  };
  /// REMOVE THIS CODE AFTER PRODUCTION
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("running dev code");

      const { uid } = await admin.auth().verifyIdToken(token);
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { videos: videosUrl, keywords: keywordsUrl } = docSnap.data();

        await auth.setCustomUserClaims(uid, { videosUrl, keywordsUrl });

        const sessionCookie = await auth.createSessionCookie(token, {
          expiresIn: sessionCookieExpiration,
        });

        console.log("got to setting the cookie");
        // Set cookie policy for session cookie.

        const res = NextResponse.json(
          { message: "Successfully set cookie!" },
          { status: 200 }
        );
        res.cookies.set({
          name: "session",
          value: sessionCookie,
          ...options,
        });
        return res;
      } else {
        return NextResponse.json(
          {
            error:
              "bad request. The user does not have a firebas field containing the videos and the keywords",
          },
          { status: 401 }
        );
      }
      //REMOVE ALL OF THE CODE ABOVE
    } else {
      const sessionCookie = await auth.createSessionCookie(token, {
        expiresIn: sessionCookieExpiration,
      });

      console.log("got to setting the cookie");
      // Set cookie policy for session cookie.

      const res = NextResponse.json(
        { message: "Successfully set cookie!" },
        { status: 200 }
      );
      res.cookies.set({
        name: "session",
        value: sessionCookie,
        ...options,
      });
      return res;
    }

    //DELETE THE PREVIOUS CODE IN PROUDUCTION

    const sessionCookie = await auth.createSessionCookie(token, {
      expiresIn: sessionCookieExpiration,
    });

    console.log("got to setting the cookie");
    // Set cookie policy for session cookie.

    const res = NextResponse.json(
      { message: "Successfully set cookie!" },
      { status: 200 }
    );
    res.cookies.set({
      name: "session",
      value: sessionCookie,
      ...options,
    });
    return res;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
