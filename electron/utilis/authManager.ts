/**
 * Refreshes the ID token using the saved refresh token and Web API key.
 * Saves the new ID token to the file system.
 */
export const refreshIdToken = async (
  webApiKey: string,
  refreshToken: string
) => {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/token?key=${webApiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    }
  );
  if (!response.ok) {
    console.error(response.statusText);
  }
  const data = await response.json();
  return data.id_token; // This returns the new ID token
};
