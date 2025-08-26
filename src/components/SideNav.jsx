import { useState, useEffect } from "react";
import { Box, Divider } from "@mui/material";

const SideNav = ({ spotifyApi, token }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (!token) return;

    spotifyApi.setAccessToken(token);

    spotifyApi.getUserPlaylists()
      .then((data) => {
        setPlaylists(data.items);
      })
      .catch((err) => {
        console.error("Fel vid hämtning av spellistor:", err);
      });
  }, [spotifyApi, token]);

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        width: "230px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box p={3}>
        <img src="/Spotify_Logo.png" alt="Spotify logo" width={"75%"} />
      </Box>

      <Box px={3} py={1}>
        <Divider sx={{ backgroundColor: "#ffffff40" }} />
      </Box>

      <Box sx={{ overflowY: "auto", flex: 1, px: 3 }}>
        <h4>Mina spellistor</h4>
        <ul>
          {playlists.map((pl) => (
            <li key={pl.id}>{pl.name}</li>
          ))}
        </ul>
      </Box>
    </Box>
  );
};

export default SideNav;