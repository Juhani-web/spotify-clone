import React from 'react';
import { Avatar, Box, Typography, Skeleton } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import SongTable from '../components/SongTable/SongTable';

const Playlist = ({ spotifyApi, token }) => {
	const { id } = useParams();
	const [songs, setSongs] = useState([]);
	const [playlistInfo, setPlaylistInfo] = useState(null);
	const [status, setStatus] = useState({ isLoading: true, error: null });

	// Format tracks
	const formatSongs = useCallback(
		(items) =>
			items
				.filter((item) => item.track) // filtrera bort tomma
				.map((item, i) => {
					const track = item.track;
					track.contextUri = `spotify:playlist:${id}`;
					track.position = i;
					return track;
				}),
		[id]
	);

	useEffect(() => {
		const getData = async () => {
			if (!spotifyApi || !token) {
				console.warn('⚠️ Ingen token eller Spotify API ännu.');
				return;
			}

			setStatus({ isLoading: true, error: null });

			try {
				// ✅ sätt token här innan varje Spotify-anrop
				spotifyApi.setAccessToken(token);

				const playlistDetails = await spotifyApi.getPlaylist(id);
				console.log('✅ Playlist hämtad:', playlistDetails);

				setPlaylistInfo({
					image: playlistDetails.body.images?.[0]?.url || null,
					name: playlistDetails.body.name || 'Okänd spellista'
				});

				const { items } = playlistDetails.body.tracks;
				const formattedSongs = formatSongs(items);
				setSongs(formattedSongs);
			} catch (err) {
				console.error('❌ Kunde inte hämta playlist:', err);
				setStatus({ isLoading: false, error: err });
			} finally {
				setStatus((prev) => ({ ...prev, isLoading: false }));
			}
		};

		getData();
	}, [id, formatSongs, spotifyApi, token]);

	return (
		<Box
			id="Playlist__page"
			sx={{
				backgroundColor: 'background.paper',
				flex: 1,
				overflowY: 'auto'
			}}
		>
			<Box
				p={{ xs: 3, md: 4 }}
				sx={{
					width: '100%',
					background: 'linear-gradient(180deg, #1db954 0%, #121212 100%)',
					display: 'flex',
					justifyContent: 'flex-start',
					alignItems: { xs: 'flex-start', md: 'flex-end', xl: 'center' },
					gap: 3,
					boxSizing: 'border-box',
					flexDirection: { xs: 'column', md: 'row' }
				}}
			>
				{/* 🎵 Bild */}
				{status.isLoading ? (
					<Skeleton
						variant="rectangular"
						sx={{
							width: { xs: '100%', md: 235 },
							height: { xs: '100%', md: 235 }
						}}
					/>
				) : (
					<Avatar
						src={playlistInfo?.image}
						variant="square"
						alt={playlistInfo?.name}
						sx={{
							boxShadow: 10,
							width: { xs: '100%', md: 235 },
							height: { xs: '100%', md: 235 }
						}}
					/>
				)}

				{/* 🎧 Titel */}
				<Box>
					<Typography
						sx={{
							fontSize: 12,
							fontWeight: 'bold',
							color: 'text.primary',
							mb: 1
						}}
					>
						Playlist
					</Typography>

					{status.isLoading ? (
						<Skeleton
							variant="text"
							sx={{
								fontSize: { xs: 42, md: 72 },
								width: 200
							}}
						/>
					) : (
						<Typography
							sx={{
								fontSize: { xs: 42, md: 72 },
								fontWeight: 'bold',
								color: 'text.primary'
							}}
						>
							{playlistInfo?.name}
						</Typography>
					)}
				</Box>
			</Box>

			{/* 🎶 Låt-tabell */}
			<SongTable songs={songs} loading={status.isLoading} spotifyApi={spotifyApi} />
		</Box>
	);
};

export default Playlist;
