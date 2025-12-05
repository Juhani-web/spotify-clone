// src/components/NavItem/NavItem.jsx
import { Box } from '@mui/material';
import { NavLink } from 'react-router-dom';
import './NavItem.css';

const NavItem = ({ name, Icon, target }) => {
	return (
		<NavLink
			to={target}
			className={({ isActive }) => `NavLink ${isActive ? 'active' : ''}`}
			style={{ textDecoration: 'none' }}
		>
			<Box
				px={3}
				py={1}
				sx={{
					display: 'flex',
					alignItems: 'center',
					fontWeight: 'bold',
					cursor: 'pointer',
					color: '#b3b3b3',
					'&:hover': { color: 'white' },
					transition: 'color 0.2s ease-in-out',
					fontSize: 14
				}}
			>
				{Icon && <Icon className="nav-icon" sx={{ fontSize: 28, marginRight: 8 }} />}
				{name}
			</Box>
		</NavLink>
	);
};

export default NavItem;
