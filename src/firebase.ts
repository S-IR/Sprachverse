// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";
import { z } from "zod";
import { LANGUAGE_CODES, languageLevels } from "./constants/general/languages";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const LanguageLevelSchema = z.record(
  z.enum(LANGUAGE_CODES),
  z.record(z.enum(["hearing", "reading"]), z.enum(languageLevels).nullable())
);
const userDocSchema = z.object({
  uid: z.string().min(10),
  email: z.string().email(),
  username: z.string(),
  languageLevel: LanguageLevelSchema,
});

export type UserLanguagesLevel = z.infer<typeof LanguageLevelSchema>;
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuPMWRareU_UwFDScr-KrJ7qFM-X9knGA",
  authDomain: "sprachverse.firebaseapp.com",
  projectId: "sprachverse",
  storageBucket: "sprachverse.appspot.com",
  messagingSenderId: "410374851579",
  appId: "1:410374851579:web:cd7dd204e14a356615195e",
  measurementId: "G-FY63D1DPMV",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();

const auth = getAuth();
const storage = getStorage();

export const createUserDoc = (
  uid: string,
  email: string,
  username: string = "Not Specified",
  languageLevel: UserLanguagesLevel = { de: { hearing: null, reading: null } }
) => {
  userDocSchema.parse({ uid, email, username, languageLevel });
  setDoc(doc(db, "users", uid), {
    email,
    username,
    languageLevel,
  });
};
export { auth, db, storage };
