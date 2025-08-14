import { useState, useEffect} from 'react';
import { Box, Divider } from '@mui/material';

const SideNav = ({ spotifyApi, token}) => {
    return <Box>
        <Box>
            <img src="/Spotify_Logo.png" alt="" />
        </Box>
        <Box>
            <Divider sx={{ backgroundcolor: '#ffffff40'}}/>
        </Box>
        <Box>{/*playlists*/}</Box>
    </Box>;
};

export default SideNav;