import { Box, Typography } from '@mui/material';

const Home = () => {
	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h3" fontWeight="bold" gutterBottom>
				Välkommen till din Spotify-klon 🎶
			</Typography>
			<Typography variant="body1" color="text.secondary">
				Välj en spellista i menyn för att börja spela musik.
			</Typography>
		</Box>
	);
};

export default Home;
