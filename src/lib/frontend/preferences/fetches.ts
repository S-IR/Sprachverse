export const setUserPreferences = async (
  access_token: string,
  firebase_UID?: string
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER}/api/users/preferences/from-google-auth`,
    {
      method: "POST",
      body: JSON.stringify({ access_token, firebase_UID }),
    }
  );
  return res;
};
