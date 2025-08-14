import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Home from '../../pages/Home';
import SideNav from './SideNav/SideNav';
import { getAccessTokenFromStorage } from '../../utils/getAccessTokenFromStorage';

const Dashboard = ({ spotifyApi }) => {
	const token = useState(getAccessTokenFromStorage());

	useEffect(() => {
		const onMount = async () => {
			await spotifyApi.setAccessToken(token);
		};

		if (token) {
			onMount();
		}
	}, []);

	return (
		<Box>
			<Box sx={{ flex: 1, overflowY: 'auto', display: 'flex' }}>
				<SideNav spotifyApi={spotifyApi} token={token} />
				<Routes>
					<Route path="/playlist/:id" element={<div>Playlist</div>} />
					<Route path="/library" element={<div>Library</div>} />
					<Route path="/" element={<Home />} />
				</Routes>
			</Box>
		</Box>
	);
};

export default Dashboard;
