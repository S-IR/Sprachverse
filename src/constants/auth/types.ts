import { UserCredential } from "firebase/auth";

export type authResponseType =
  | { status: "success"; user: UserCredential["user"]; isNewUser?: boolean }
  | { status: "error"; error: unknown };
