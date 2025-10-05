// src/utils/pkce.js
const clientId = import.meta.env.VITE_CLIENT_ID;

// 🔐 Generera en code_verifier (random string)
export function generateCodeVerifier(length = 128) {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let verifier = "";
  for (let i = 0; i < length; i++) {
    verifier += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return verifier;
}

// 🔐 Skapa en code_challenge (SHA-256 + base64-url)
export async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// 🔑 Hämta nytt access token (första gången med authorization code)
export const getToken = async (code) => {
  const codeVerifier = localStorage.getItem("code_verifier");
  const url = "https://accounts.spotify.com/api/token";

  const payload = {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: "http://127.0.0.1:5173/callback",
      code_verifier: codeVerifier,
    }),
  };

  const body = await fetch(url, payload);
  const response = await body.json();

  console.log("🔑 Token Response:", response);

  if (response.access_token) {
    sessionStorage.setItem("spotifyToken", response.access_token);
    sessionStorage.setItem("expiresAt", Date.now() + response.expires_in * 1000);

    if (response.refresh_token) {
      localStorage.setItem("refreshToken", response.refresh_token);
    }

    console.log("✅ Access token sparad i SessionStorage");
    return response.access_token;
  }

  console.error("❌ Kunde inte hämta token:", response);
  return null;
};

// ♻️ Förnya access_token med refresh_token
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    console.error("❌ Ingen refresh_token sparad.");
    return null;
  }

  const url = "https://accounts.spotify.com/api/token";

  const payload = {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  };

  const body = await fetch(url, payload);
  const response = await body.json();

  console.log("♻️ Refresh Response:", response);

  if (response.access_token) {
    sessionStorage.setItem("spotifyToken", response.access_token);
    sessionStorage.setItem("expiresAt", Date.now() + response.expires_in * 1000);
    console.log("✅ Access token förnyad");
    return response.access_token;
  }

  console.error("❌ Kunde inte förnya token:", response);
  return null;
};
