import './App.css';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { getAccessToken } from './utils/getAccessToken';
import { getAccessTokenFromStorage } from './utils/getAccessTokenFromStorage';
import Login from './pages/Login';
import Dashboard from './components/Dashboard/Dashboard';

function App({ spotifyApi }) {
    const [token, setToken] = useState(getAccessTokenFromStorage());
    const navigate = useNavigate();

    useEffect(() => {
        // Kolla om token redan finns i storage
        let accessToken = getAccessTokenFromStorage();

        // Om ingen token, försök läsa från URL-hash (första gången man loggar in)
        if (!accessToken) {
            accessToken = getAccessToken();
            if (accessToken) {
                sessionStorage.setItem('spotifyToken', accessToken); // fixa mellanslagsbuggen
                window.location.hash = ''; // rensa URL:en från token
            }
        }

        // Om vi har token → sätt state och navigera till Home
        if (accessToken) {
            setToken(accessToken);
            navigate('/');
        }
    }, [navigate]);

    return (
        <Box className="App">
            {token ? (
                <Dashboard spotifyApi={spotifyApi} />
            ) : (
                <Routes>
                    <Route path="*" element={<Login />} />
                </Routes>
            )}
        </Box>
    );
}

export default App;
