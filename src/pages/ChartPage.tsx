import React from 'react'; // Removed useEffect
import { Container, Typography, Box } from '@mui/material';
import TaskChart from '../components/TaskChart'; // Import the chart component

const ChartPage: React.FC = () => {
	return (
		<Container maxWidth='md'>
			<Box sx={{ my: 4 }}>
				{' '}
				{/* Add some margin top and bottom */}
				<Typography
					variant='h4'
					component='h1'
					gutterBottom
				>
					Task Status Chart
				</Typography>
				<TaskChart /> {/* Render the chart component */}
			</Box>
		</Container>
	);
};

export default ChartPage;
