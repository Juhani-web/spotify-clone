// src/pages/Playlist.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

const Playlist = ({ spotifyApi }) => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    if (!id) return;

    const token = sessionStorage.getItem("spotifyToken");
    if (!token) {
      console.warn("⚠️ Ingen token hittad i sessionStorage");
      return;
    }

    // Säkerställ att Spotify-klienten har en giltig token
    spotifyApi.setAccessToken(token);

    spotifyApi.getPlaylist(id).then(
      (data) => {
        setPlaylist(data);
      },
      (err) => {
        console.error("❌ Fel vid hämtning av playlist:", err);
      }
    );
  }, [id, spotifyApi]);

  if (!playlist) {
    return <Typography variant="h6">Laddar spellista...</Typography>;
  }

  const handleTrackClick = async (track) => {
    try {
      // Spara i sessionStorage så Player kan hämta
      sessionStorage.setItem("currentTrackUri", track.uri);
      sessionStorage.setItem("currentContextUri", playlist.uri);

      // Starta playback direkt
      await spotifyApi.play({
        context_uri: playlist.uri,
        offset: { uri: track.uri },
      });

      // Trigga Player att uppdatera
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("⚠️ Kunde inte spela låt:", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {playlist.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {playlist.tracks.items.length} låtar
      </Typography>

      <List>
        {playlist.tracks.items.map((item, index) => {
          const track = item.track;
          return (
            <ListItem
              key={index}
              button
              onClick={() => handleTrackClick(track)}
              sx={{
                "&:hover": { bgcolor: "grey.900" },
              }}
            >
              <ListItemText
                primary={track.name}
                secondary={track.artists.map((a) => a.name).join(", ")}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Playlist;
