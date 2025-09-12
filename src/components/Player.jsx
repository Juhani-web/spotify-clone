// src/components/Player.jsx
import { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { PlayArrow, Pause, SkipNext, SkipPrevious } from "@mui/icons-material";

const Player = ({ spotifyApi }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [track, setTrack] = useState(null);

  // Uppdatera låten när något ändras i sessionStorage (t.ex. klick i Playlist)
  useEffect(() => {
    const updateTrack = async () => {
      const trackUri = sessionStorage.getItem("currentTrackUri");
      const contextUri = sessionStorage.getItem("currentContextUri");

      if (!trackUri) return;

      try {
        if (contextUri) {
          // Spela spellistan och börja på låten
          await spotifyApi.play({
            context_uri: contextUri,
            offset: { uri: trackUri },
          });
        } else {
          // Fallback: spela bara låten
          await spotifyApi.play({ uris: [trackUri] });
        }

        // Hämta info om nuvarande låt
        const trackId = trackUri.split(":").pop();
        const data = await spotifyApi.getTrack(trackId);
        setTrack(data);
        setIsPlaying(true);
      } catch (err) {
        console.error("⚠️ Kunde inte spela upp:", err);
      }
    };

    updateTrack();

    // Lyssna på sessionStorage-förändringar
    const handler = () => updateTrack();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [spotifyApi]);

  const handlePause = () => {
    spotifyApi.pause().then(
      () => setIsPlaying(false),
      (err) => console.error("Fel vid pause:", err)
    );
  };

  const handlePlay = async () => {
    try {
      await spotifyApi.play();
      const current = await spotifyApi.getMyCurrentPlayingTrack();
      if (current?.item) setTrack(current.item);
      setIsPlaying(true);
    } catch (err) {
      console.error("Fel vid play:", err);
    }
  };

  const handleNext = async () => {
    try {
      await spotifyApi.skipToNext();
      const current = await spotifyApi.getMyCurrentPlayingTrack();
      if (current?.item) {
        setTrack(current.item);
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Fel vid next:", err);
    }
  };

  const handlePrev = async () => {
    try {
      await spotifyApi.skipToPrevious();
      const current = await spotifyApi.getMyCurrentPlayingTrack();
      if (current?.item) {
        setTrack(current.item);
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Fel vid prev:", err);
    }
  };

  if (!track) {
    return (
      <Box
        sx={{ p: 2, bgcolor: "grey.900", color: "white", textAlign: "center" }}
      >
        <Typography variant="body2">Ingen låt vald</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "grey.900",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Låtinfo */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <img
          src={track.album?.images?.[2]?.url || ""}
          alt={track.name}
          style={{ width: 48, height: 48, borderRadius: 4 }}
        />
        <Box>
          <Typography variant="body1" fontWeight="bold">
            {track.name}
          </Typography>
          <Typography variant="body2" color="grey.400">
            {track.artists.map((a) => a.name).join(", ")}
          </Typography>
        </Box>
      </Box>

      {/* Kontroller */}
      <Box>
        <IconButton onClick={handlePrev} color="inherit">
          <SkipPrevious />
        </IconButton>
        {isPlaying ? (
          <IconButton onClick={handlePause} color="inherit">
            <Pause />
          </IconButton>
        ) : (
          <IconButton onClick={handlePlay} color="inherit">
            <PlayArrow />
          </IconButton>
        )}
        <IconButton onClick={handleNext} color="inherit">
          <SkipNext />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Player;
