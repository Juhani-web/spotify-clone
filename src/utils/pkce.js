const clientId = import.meta.env.VITE_CLIENT_ID;

// 🔑 Första inloggningen: hämta access_token + refresh_token
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

    // 👇 refresh_token måste sparas i localStorage
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

  try {
    const body = await fetch(url, payload);
    const response = await body.json();
    console.log("♻️ Refresh Response:", response);

    // ✅ Om Spotify returnerar nytt access_token
    if (response.access_token) {
      sessionStorage.setItem("spotifyToken", response.access_token);
      sessionStorage.setItem("expiresAt", Date.now() + response.expires_in * 1000);
      console.log("✅ Access token förnyad");
      return response.access_token;
    }

    // ⚠️ Om Spotify skickar error men vi har en giltig token kvar → använd den
    const existingToken = sessionStorage.getItem("spotifyToken");
    if (existingToken) {
      console.warn("⚠️ Refresh misslyckades, använder befintligt token.");
      return existingToken;
    }

    console.error("❌ Kunde inte förnya token:", response);
    return null;
  } catch (err) {
    console.error("❌ Nätverksfel vid refresh:", err);
    return sessionStorage.getItem("spotifyToken") || null;
  }
};
