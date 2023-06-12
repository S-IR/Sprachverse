import axios from "axios";
import {
  FacebookAuthProvider,
  getAdditionalUserInfo,
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  User,
  UserCredential,
} from "firebase/auth";
import { useRouter } from "next/router";
import React from "react";
import { auth, createUserDoc, UserLanguagesLevel } from "../firebase";
import { requestSetSessionCookie } from "@/lib/frontend/auth/sessionCookies";
import { authResponseType } from "@/constants/auth/types";
import { useUserStore } from "@/store/UserStore";
// const { google } = require("googleapis");
// const OAuth2Client = google.auth.OAuth2;

/**
 * React hook meant to allow for logging and signing in through third parties such as google , facebook etc.
 * @returns
 */
export default function useAuthThirdParty(languageLevel?: UserLanguagesLevel) {
  const authWithGoogle = async (): Promise<authResponseType> => {
    const googleProvider = new GoogleAuthProvider();
    //     const oauth2Client = new OAuth2Client({
    //   clientId: 'YOUR_CLIENT_ID',
    //   clientSecret: 'YOUR_CLIENT_SECRET',
    //   redirectUri: 'YOUR_REDIRECT_URI',
    // });
    googleProvider.addScope("https://www.googleapis.com/auth/youtube.readonly");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user === null) throw new Error("result is Null at useAuthThirdParty");
      console.log("result", result);

      // Get the access token
      // const accessToken = user.stsTokenManager.accessToken;
      // console.log("Access Token:", accessToken);
      if (result.code !== undefined)
        return { status: "error", error: result.code };
      const isNewUser = getAdditionalUserInfo(result)?.isNewUser || false;
      if (isNewUser) {
        createUserDoc(
          user.uid,
          user.email as string,
          user.displayName !== null ? user.displayName : undefined,
          languageLevel
        );
      }

      const token = await user.getIdToken();
      await requestSetSessionCookie(token);

      return {
        status: "success",
        user,
        isNewUser,
        oauthAccessToken: result._tokenResponse.oauthAccessToken,
      };
      // if (!isNewUser) {
      //   // window.gtag(`event`, `login`, {
      //   //   method: "Google",
      //   // });
      //   const token = await result.user.getIdToken();
      //   await requestSetSessionCookie(token);
      //   return { status: "success", user: result.user, isNewUser: false };
      // } else {
      //   const UserLanguagesLevel = useUserStore(
      //     (store) => store.UserLanguagesLevel
      //   );
      //   const { uid, displayName, email } = result.user;
      //   createUserDoc(
      //     uid,
      //     email as string,
      //     displayName as string,
      //     UserLanguagesLevel
      //   );
      //   let token = await result.user.getIdToken();
      //   //   window.gtag(`event`, `sign_up`, {
      //   //     method: "Google",
      //   //   });
      //   token = await result.user.getIdToken(true);
      //   await requestSetSessionCookie(token);

      //   return { status: "success", user: result.user, isNewUser: true };
      // }
    } catch (error) {
      return { status: "error", error };
    }
  };

  // const authWithFacebook = async (): Promise<authResponseType> => {
  //   //TODO
  //   const auth = getAuth();
  //   const facebookProvider = new FacebookAuthProvider();
  //   try {
  //     //TODO
  //     const user = await signInWithPopup(auth, facebookProvider);
  //     if (user.code) return { status: "error", error: user.code };
  //     window.gtag(`event`, `sign_up`, {
  //       method: "Facebook",
  //     });
  //     return { status: "success", user: user.user };
  //   } catch (error) {
  //     return { status: "error", error };
  //   }
  // };

  // const authWithPinterest = async (): Promise<authResponseType> => {
  //   //TODO
  //   const auth = getAuth();
  //   let user: User;
  //   return { status: "success", user };
  // };
  return [authWithGoogle];
}
