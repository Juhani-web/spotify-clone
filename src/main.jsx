import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import { ThemeProvider } from '@mui/system';
import { themeOptions } from './theme/material-theme';

const spotifyApi = new SpotifyWebApi({
	clientId: import.meta.env.VITE_CLIENT_ID,
	clientSecret: import.meta.env.VITE_CLIENT_SECRET,
	redirectUri: 'http://127.0.0.1:5173/callback'
});

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<BrowserRouter>
			<ThemeProvider theme={themeOptions}>
				<App spotifyApi={spotifyApi} />
			</ThemeProvider>
		</BrowserRouter>
	</React.StrictMode>
);
