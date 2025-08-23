import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import SideNav from "../components/SideNav";
import Player from "../components/Player";
import { getAccessTokenFromStorage } from "../utils/getAccessTokenFromStorage";

const Dashboard = ({ spotifyApi }) => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hämta token från storage (sessionStorage)
    const storedToken = getAccessTokenFromStorage();

    if (storedToken) {
      spotifyApi.setAccessToken(storedToken);
      setToken(storedToken);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
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
        <Outlet /> {/* Här laddas Home, Library, Playlist etc */}
      </Box>

      {/* Player visas bara om token finns och laddning är klar */}
      {!isLoading && token && <Player spotifyApi={spotifyApi} />}
    </Box>
  );
};

export default Dashboard;
