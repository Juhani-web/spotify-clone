import React, { useEffect, useState } from 'react';
import { Box, Divider } from '@mui/material';
import NavItem from '../NavItem/NavItem';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import NavPlaylist from '../NavPlaylist/NavPlaylist';

const SideNav = ({ spotifyApi, token }) => {
	const [albumList, setAlbumList] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
  async function getPlaylists() {
    if (!spotifyApi || !token) return;
    try {
      spotifyApi.setAccessToken(token); // säkerställ att API:t får token
      const data = await spotifyApi.getUserPlaylists();

      // 👇 Lägg till den här raden för att få exakt samma log som läraren
      console.log("📀 playlists:", data.body.items);

      setAlbumList(data.body.items || []);
    } catch (err) {
      console.error("❌ Fel vid hämtning av playlists:", err);
    } finally {
      setLoading(false);
    }
  }
  getPlaylists();
}, [spotifyApi, token]);



	const renderPlaylist = () => {
		if (loading) {
			return Array.from({ length: 10 }).map((_, id) => <NavPlaylist key={id} loading={true} />);
		}
		return albumList.map((playlist) => (
			<NavPlaylist key={playlist.id} id={playlist.id} loading={false} name={playlist.name} />
		));
	};

	return (
		<Box
			sx={{
				backgroundColor: 'background.default',
				width: 230,
				height: '100%',
				display: 'flex',
				flexDirection: 'column'
			}}
		>
			<Box p={3}>
				<img src="/Spotify_Logo.png" alt="Spotify logo" width={'75%'} />
			</Box>

			<Box sx={{ mb: 2 }}>
				<NavItem name="Home" Icon={HomeRoundedIcon} target="/dashboard" />
				<NavItem name="Library" Icon={LibraryMusicIcon} target="/dashboard/library" />
			</Box>

			<Divider sx={{ backgroundColor: '#ffffff40', mb: 2 }} />

			<Box sx={{ overflowY: 'auto', flex: 1 }}>{renderPlaylist()}</Box>
		</Box>
	);
};

export default SideNav;
