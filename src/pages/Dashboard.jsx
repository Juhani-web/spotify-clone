// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import SideNav from "../components/SideNav";
import Player from "../components/Player";
import { getAccessTokenFromStorage } from "../utils/getAccessTokenFromStorage";
import { refreshAccessToken } from "../utils/pkce";

const Dashboard = ({ spotifyApi }) => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      let storedToken = getAccessTokenFromStorage();
      const expiresAt = sessionStorage.getItem("expiresAt");

      // ⚠️ Token saknas eller har gått ut → försök förnya
      if (!storedToken || (expiresAt && Date.now() > parseInt(expiresAt, 10))) {
        console.warn("🔄 Access token saknas eller har gått ut, försöker förnya...");
        storedToken = await refreshAccessToken();
      }

      if (storedToken) {
        console.log("✅ Token satt i Dashboard:", storedToken.substring(0, 15) + "...");
        spotifyApi.setAccessToken(storedToken);
        setToken(storedToken);
      } else {
        console.error("❌ Kunde inte sätta token i Dashboard");
      }

      setIsLoading(false);
    };

    checkToken();
  }, [spotifyApi]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Main layout */}
      <Box sx={{ flex: 1, overflow: "auto", display: "flex" }}>
        <SideNav spotifyApi={spotifyApi} token={token} />
        <Outlet />
      </Box>

      {/* Player visas bara om token finns och laddning är klar */}
      {!isLoading && token && <Player spotifyApi={spotifyApi} />}
    </Box>
  );
};

export default Dashboard;
