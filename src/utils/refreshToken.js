// src/utils/refreshToken.js
export const refreshAccessToken = async () => {
  const refreshToken = sessionStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: import.meta.env.VITE_CLIENT_ID,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  };

  const body = await fetch(url, payload);
  const response = await body.json();

  if (response.access_token) {
    sessionStorage.setItem("spotifyToken", response.access_token);
    sessionStorage.setItem("expiresAt", Date.now() + response.expires_in * 1000);
    console.log("♻️ Refreshed token");
    return response.access_token;
  }
  return null;
};
