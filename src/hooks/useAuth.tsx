import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, createUserDoc, db } from "../firebase";
import { deleteCookie } from "cookies-next";
import { authResponseType } from "@/constants/auth/types";

const useAuth = (): [
  (
    email: string,
    password: string,
    username: string
  ) => Promise<authResponseType>,
  (email: string, password: string) => Promise<authResponseType>,
  () => Promise<void>,
  boolean
] => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const signUp = () => undefined;
  const signIn = () => undefined;
  //   /**
  //    * Creates a firebase account for the user, sends a verification email to the email address and if there were no errors sets a gtag event for sign up
  //    * @param email user's email from input
  //    * @param password user's password from input
  //    * @param username user's username from input
  //    * @returns {Promise<authResponseType>}
  //    */
  //   const signUp = async (
  //     email: string,
  //     password: string,
  //     username: string
  //   ): Promise<authResponseType> => {
  //     setLoading(true);
  //     try {
  //       const userCredential = await createUserWithEmailAndPassword(
  //         auth,
  //         email,
  //         password
  //       );
  //       const resBody = await verifyEmail(userCredential.user.email as string);
  //       createUserDoc(userCredential.user.uid, email, username, "bronze");
  //       if (resBody.status === 200) {
  //         window.gtag(`event`, `sign_up`, {
  //           method: "Aftin",
  //         });
  //         let token = await userCredential.user.getIdToken();
  //         await requestSetTier(token, "bronze");
  //         token = await userCredential.user.getIdToken(true);
  //         await requestSetSessionCookie(token);
  //         return { status: `success`, user: userCredential.user };
  //       } else {
  //         return { status: "error", error: resBody };
  //       }
  //     } catch (error) {
  //       return { status: `error`, error };
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   /**
  //    * Signs in the user and sends a gtag login event
  //    * @param email
  //    * @param password
  //    * @returns {Promise<authResponseType>}
  //    */
  //   const signIn = async (
  //     email: string,
  //     password: string
  //   ): Promise<authResponseType> => {
  //     setLoading(true);
  //     try {
  //       const userCredential = await signInWithEmailAndPassword(
  //         auth,
  //         email,
  //         password
  //       );
  //       if (userCredential) {
  //         setLoading(false);
  //         window.gtag(`event`, `login`, {
  //           method: "Aftin",
  //         });
  //         const token = await userCredential.user.getIdToken();
  //         await requestSetSessionCookie(token);
  //         return { status: "success", user: userCredential.user };
  //       } else {
  //         return { status: "error", error: userCredential.code };
  //       }
  //     } catch (error) {
  //       setLoading(false);
  //       return { status: "error", error };
  //     }
  //   };

  /**
   * Logs out the user and sends him to /login
   */
  const logout = async () => {
    setLoading(true);
    signOut(auth)
      .then(async () => {
        deleteCookie("session", {
          maxAge: parseInt(
            process.env.NEXT_PUBLIC_sessionCookieExpiration as string
          ),
          httpOnly: true,
          secure: true,
        });
        return router.push("/");
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };
  return [signUp, signIn, logout, loading];
};
export default useAuth;
