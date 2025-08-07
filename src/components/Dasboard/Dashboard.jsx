import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SideNav from '../SideNav';
import Player from '../Player';

const Dashboard = ({ spotifyApi }) => {
  const [isLoading, setIsLoading] = useState(true);
  const token = sessionStorage.getItem('access_token');

  useEffect(() => {
    if (token) {
      spotifyApi.setAccessToken(token);
      setIsLoading(false);
    }
  }, [token, spotifyApi]);

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, overflow: 'auto', display: 'flex' }}>
        <SideNav spotifyApi={spotifyApi} token={token} />
        <Outlet />
      </Box>
      {!isLoading && <Player spotifyApi={spotifyApi} />}
    </Box>
  );
};

export default Dashboard;
