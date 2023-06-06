import { UserCredential } from "firebase/auth";

export type authResponseType =
  | {
      status: "success";
      user: UserCredential["user"];
      isNewUser?: boolean;
      oauthAccessToken?: string;
    }
  | { status: "error"; error: unknown };
