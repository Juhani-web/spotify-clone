import React from 'react';
import { Grid, Avatar, Box, Typography, Skeleton } from '@mui/material';
import { formatTime } from '../../utils/formatTime.js';

const SongRow = ({
	images,
	title,
	artist,
	album,
	duration,
	i,
	loading,
	position,
	contextUri,
	spotifyApi
}) => {
	const image = images?.length > 0 ? images[0].url : null;

	const onRowClick = async () => {
		if (!spotifyApi) {
			console.error("❌ spotifyApi saknas i SongRow!");
			return;
		}

		try {
			// 🔍 Hämta enheter
			const devicesResponse = await spotifyApi.getMyDevices();
			const devices = devicesResponse.body.devices;

			// 🎧 Leta efter aktiv enhet
			let activeDevice = devices.find(d => d.is_active);

			// Om ingen aktiv enhet → flytta playback
			if (!activeDevice && devices.length > 0) {
				activeDevice = devices[0];

				await spotifyApi.transferMyPlayback({
					device_ids: [activeDevice.id],
					play: false
				});
			}

			// 🚨 Om inga enheter hittades
			if (!activeDevice) {
				console.warn("⚠️ Ingen Spotify-enhet hittad för uppspelning.");
				return;
			}

			// ▶️ Spela låten i rätt spellista & position
			await spotifyApi.play({
				device_id: activeDevice.id,
				context_uri: contextUri,
				offset: { position },
				position_ms: 0
			});

		} catch (error) {
			console.error("❌ Kunde inte spela upp låten:", error);
		}
	};

	return (
		<Grid
			onClick={onRowClick}
			container
			px={2}
			p={1}
			sx={{
				width: '100%',
				color: 'text.secondary',
				fontSize: 14,
				cursor: 'pointer',
				'&:hover': { backgroundColor: '#ffffff10' }
			}}
		>
			{/* Index */}
			<Grid sx={{ width: 35, display: 'flex', alignItems: 'center', fontSize: 16 }} item>
				{i + 1}
			</Grid>

			{/* Song info */}
			<Grid item sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
				{loading ? (
					<Skeleton variant="rectangular" width={40} height={40} />
				) : (
					<Avatar src={image} alt={null} variant="square" />
				)}

				<Box>
					<Typography sx={{ fontSize: 16, color: 'text.primary' }}>
						{loading ? <Skeleton variant="text" width={130} height={24} /> : title}
					</Typography>

					<Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
						{loading ? <Skeleton variant="text" width={50} height={18} /> : artist}
					</Typography>
				</Box>
			</Grid>

			{/* Album */}
			<Grid xs={3} item sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
				{loading ? <Skeleton variant="text" width={50} height={24} /> : album}
			</Grid>

			{/* Duration */}
			<Grid xs={3} item sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
				{loading ? <Skeleton variant="text" width={50} height={24} /> : formatTime(duration)}
			</Grid>
		</Grid>
	);
};

export default SongRow;
