// src/pages/Playlist.jsx
import { Avatar, Box, Typography } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

const Playlist = ({ spotifyApi, token }) => {
	const { id } = useParams();
	const [songs, setSongs] = useState([]);
	const [playlistInfo, setPlaylistInfo] = useState(null);

	const formatSongs = useCallback(
		(items) =>
			items.map((item, i) => {
				console.log({ item, i });
				const track = item;
				track.contextUri = `spotify:playlist:${id}`;
				track.position = i;
				return track;
			}),
		[id]
	);

	useEffect(() => {
		const getData = async () => {
			try {
				const playlistDetails = await spotifyApi.getPlaylist(id);
				setPlaylistInfo({
					image: playlistDetails.body.images[0].url,
					name: playlistDetails.body.name
				});
				console.log(playlistDetails);
				const { items } = playlistDetails.body.tracks;
				//format songs
				const formattedSongs = formatSongs(items);
				setSongs(formattedSongs);
			} catch (err) {
				console.error('❌ Kunde inte hämta playlist:', err);
			}
		};

		getData();
	}, [id, formatSongs]);

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

				<Box>
					<Typography
						sx={{
							fontSize: 12,
							fontWeight: 'bold',
							color: '#fff',
							mb: 1
						}}
					>
						Playlist
					</Typography>
					<Typography
						sx={{
							fontSize: { xs: 42, md: 72 },
							fontWeight: 'bold',
							color: '#fff'
						}}
					>
						{playlistInfo?.name}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default Playlist;
