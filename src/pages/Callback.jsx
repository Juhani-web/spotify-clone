import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SpotifyCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      console.error("Ingen authorization code i callback-URL");
      return;
    }

    // Byt ut mot ditt backend-API som pratar med Spotify /api/token
    fetch("http://localhost:3001/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        sessionStorage.setItem("spotifyToken", data.access_token);
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("Token exchange error:", err);
      });
  }, [navigate]);

  return <p>Loggar in...</p>;
};

export default SpotifyCallback;
