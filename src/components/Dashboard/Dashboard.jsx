// src/components/Dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';

import SideNav from '../SideNav/SideNav.jsx';
import Player from '../Player/Player.jsx';

import Home from '../../pages/Home.jsx';
import Playlist from '../../pages/Playlist.jsx';
import Library from '../../pages/Library.jsx';

import { getAccessTokenFromStorage } from '../../utils/getAccessTokenFromStorage.js';
import { refreshAccessToken } from '../../utils/pkce.js';

const Dashboard = ({ spotifyApi }) => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🚀 Hämta token när Dashboard mountas
  useEffect(() => {
    const initToken = async () => {
      let storedToken = getAccessTokenFromStorage();
      const expiresAt = sessionStorage.getItem('expiresAt');

      if (storedToken && expiresAt && Date.now() < parseInt(expiresAt, 10)) {
        spotifyApi.setAccessToken(storedToken);
        setToken(storedToken);
        console.log('✅ Token satt i Dashboard:', storedToken.substring(0, 15) + '...');
      } else if (localStorage.getItem('refreshToken')) {
        console.log('🔄 Försöker förnya token...');
        const newToken = await refreshAccessToken();
        if (newToken) {
          spotifyApi.setAccessToken(newToken);
          setToken(newToken);
          console.log('✅ Ny token satt i Dashboard:', newToken.substring(0, 15) + '...');
        } else {
          console.error('❌ Kunde inte förnya token');
        }
      } else {
        console.warn('⚠️ Ingen token hittad i storage');
      }

      setIsLoading(false);
    };

    initToken();
  }, [spotifyApi]);

  // ♻️ Förnya token automatiskt innan den går ut
  useEffect(() => {
    const interval = setInterval(async () => {
      const expiresAt = sessionStorage.getItem('expiresAt');
      if (expiresAt && Date.now() > parseInt(expiresAt, 10)) {
        console.log('🔄 Token har gått ut, försöker förnya...');
        const newToken = await refreshAccessToken();
        if (newToken) {
          spotifyApi.setAccessToken(newToken);
          setToken(newToken);
          console.log('✅ Token uppdaterad via interval:', newToken.substring(0, 15) + '...');
        }
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [spotifyApi]);

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Layout */}
      <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex' }}>
        <SideNav spotifyApi={spotifyApi} token={token} />

        {/* 👇 Här renderas barnroutes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="playlist/:id" element={<Playlist spotifyApi={spotifyApi} token={token} />} />
          <Route path="library" element={<Library spotifyApi={spotifyApi} />} />
        </Routes>
      </Box>

      {/* Player visas bara om token finns */}
      {!isLoading && token && <Player spotifyApi={spotifyApi} />}
    </Box>
  );
};

export default Dashboard;
