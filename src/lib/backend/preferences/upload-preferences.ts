import {
  getDownloadURL,
  ref,
  StorageReference,
  uploadBytes,
  uploadBytesResumable,
  uploadString,
} from "firebase/storage";
import { db, storage } from "@/firebase";
import { assert } from "console";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { z } from "zod";

export const uploadPreference = async (
  name: "videos" | "channels" | "keywords",
  jsonValue: string,
  firebase_uid: string
) => {
  z.enum(["videos", "channels", "keywords"]).parse(name);
  const docRef = doc(db, "users", firebase_uid);

  const storageRef = ref(
    storage,
    `/users/preference/${firebase_uid}/${name}.json`
  );
  assert(jsonValue === undefined, "jsonValue undefined at uploadPreference");
  const byteArray = new Uint8Array(
    jsonValue.split("").map((char) => char.charCodeAt(0))
  );

  assert(byteArray === undefined, "uintArray undefined at uploadPreference");
  const snapshot = await uploadBytes(storageRef, byteArray);
  const url = await getDownloadURL(snapshot.ref);
  setDoc(docRef, { [name]: url }, { merge: true });
};
