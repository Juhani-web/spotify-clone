import { useState, useEffect } from "react";
import { Box, Divider, List, ListItem, ListItemText } from "@mui/material";

const SideNav = ({ spotifyApi, token }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (!token) return;

    spotifyApi.getUserPlaylists()
      .then((data) => {
        setPlaylists(data.items || []);
      })
      .catch((err) => {
        console.error("Kunde inte hämta spellistor:", err);
      });
  }, [spotifyApi, token]);

  return (
    <Box
      sx={{
        bgcolor: "#121212", // mörk Spotify-liknande bakgrund
        color: "#fff",      // vit text
        width: 230,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo */}
      <Box p={3}>
        <img src="/Spotify_Logo.png" alt="Spotify logo" width={"75%"} />
      </Box>

      <Divider sx={{ backgroundColor: "#ffffff40" }} />

      {/* Lista spellistor */}
      <Box sx={{ overflowY: "auto", flex: 1 }}>
        <List>
          {playlists.map((playlist) => (
            <ListItem 
              key={playlist.id} 
              button 
              component="a" 
              href={`/dashboard/playlist/${playlist.id}`}
              sx={{ color: "#fff" }} // gör texten vit
            >
              <ListItemText 
                primary={playlist.name} 
                primaryTypographyProps={{ style: { color: "#fff" } }} 
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default SideNav;
