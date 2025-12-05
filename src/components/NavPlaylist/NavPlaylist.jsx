// src/components/NavPlaylist/NavPlaylist.jsx
import { Box, Skeleton } from '@mui/material';
import { NavLink } from 'react-router-dom';
import './NavPlaylist.css';

const NavPlaylist = ({ name, id, loading }) => {
	return (
		<NavLink
			className="playlist__navlink"
			to={loading ? '' : `/dashboard/playlist/${id}`}
			style={{ textDecoration: 'none' }}
		>
			<Box
				px={3}
				py={1}
				sx={{
					cursor: 'pointer',
					'&:hover': { color: 'white' },
					transition: 'color 0.2s ease-in-out',
					fontSize: 14,
					color: '#b3b3b3'
				}}
			>
				{loading ? <Skeleton variant="text" sx={{ fontSize: 14 }} /> : name}
			</Box>
		</NavLink>
	);
};

export default NavPlaylist;
