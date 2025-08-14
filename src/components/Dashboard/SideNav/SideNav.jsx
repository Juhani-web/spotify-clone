import { useState, useEffect} from 'react';
import { Box, Divider } from '@mui/material';

const SideNav = ({ spotifyApi, token}) => {
    return <Box sx={{
        backgroundcolor: 'background.default',
        width: '230',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    }}>
        <Box p={3}>
            <img src="/Spotify_Logo.png" alt="Spotifi logo" width={'75%'} />
        </Box>
        <Box px={3} py={1} >
            <Divider sx={{ backgroundcolor: '#ffffff40'}}/>
        </Box>
        <Box sx={{ overFlowY: 'auto', flex: 1 }}>
            {/*playlists*/}
            Pop
        </Box>
    </Box>;
};

export default SideNav;