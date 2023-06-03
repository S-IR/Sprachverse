/**
 * Requests for a firebase session cookie to be set for the user
 * @param token
 */
export const requestSetSessionCookie = async (token: string): Promise<void> => {
  const res = await fetch("/api/users/set-session-cookie", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    throw new Error(`Failed to set tier: ${res.statusText}`);
  }
};
