// src/pages/Callback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/pkce";

const SpotifyCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        console.error("Ingen authorization code i URL");
        return;
      }

      const accessToken = await getToken(code);

      if (accessToken) {
        navigate("/dashboard");
      } else {
        console.error("Kunde inte hämta token");
      }
    };

    fetchToken();
  }, [navigate]);

  return <p>Loggar in...</p>;
};

export default SpotifyCallback;
