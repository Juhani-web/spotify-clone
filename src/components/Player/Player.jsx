// src/components/Player/Player.jsx
import { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { PlayArrow, Pause, SkipNext, SkipPrevious } from "@mui/icons-material";
import { refreshAccessToken } from "../../utils/pkce.js";

const Player = ({ spotifyApi }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [track, setTrack] = useState(null);

  // 🔄 Hjälpfunktion: om 401 → prova förnya token och försök igen
  const safeSpotifyCall = async (fn) => {
    try {
      return await fn();
    } catch (err) {
      if (err.status === 401) {
        console.warn("⚠️ Token verkar ha gått ut, försöker förnya...");
        const newToken = await refreshAccessToken();
        if (newToken) {
          spotifyApi.setAccessToken(newToken);
          console.log("✅ Ny token satt i Player");
          return await fn();
        }
      }
      console.error("❌ Fel i Spotify-anrop:", err);
      throw err;
    }
  };

  useEffect(() => {
    const updateTrack = async () => {
      const trackUri = sessionStorage.getItem("currentTrackUri");
      const contextUri = sessionStorage.getItem("currentContextUri");

      if (!trackUri) return;

      try {
        if (contextUri) {
          await safeSpotifyCall(() =>
            spotifyApi.play({
              context_uri: contextUri,
              offset: { uri: trackUri },
            })
          );
        } else {
          await safeSpotifyCall(() => spotifyApi.play({ uris: [trackUri] }));
        }

        const trackId = trackUri.split(":").pop();
        const data = await safeSpotifyCall(() => spotifyApi.getTrack(trackId));
        setTrack(data);
        setIsPlaying(true);
      } catch (err) {
        console.error("⚠️ Kunde inte spela upp:", err);
      }
    };

    updateTrack();

    // lyssna på storage-event
    const handler = () => updateTrack();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [spotifyApi]);

  const handlePause = async () => {
    await safeSpotifyCall(() => spotifyApi.pause());
    setIsPlaying(false);
  };

  const handlePlay = async () => {
    await safeSpotifyCall(() => spotifyApi.play());
    setIsPlaying(true);
  };

  const handleNext = async () => {
    await safeSpotifyCall(() => spotifyApi.skipToNext());
  };

  const handlePrev = async () => {
    await safeSpotifyCall(() => spotifyApi.skipToPrevious());
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
