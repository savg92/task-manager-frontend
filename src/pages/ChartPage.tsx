import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import TaskChart from '../components/TaskChart';

const ChartPage: React.FC = () => {
	return (
		<Container maxWidth='md'>
			<Box sx={{ my: 4 }}>
				{' '}
				{}
				<Typography
					variant='h4'
					component='h1'
					gutterBottom
				>
					Task Status Chart
				</Typography>
				<TaskChart /> {}
			</Box>
		</Container>
	);
};

export default ChartPage;
