import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import AddTaskForm from '../components/AddTaskForm';
import TaskList from '../components/TaskList';

const HomePage: React.FC = () => {
	return (
		<Container maxWidth='md'>
			<Box sx={{ my: 4 }}>
				<Typography
					variant='h4'
					component='h1'
					gutterBottom
					sx={{
						// Make font smaller on extra-small screens
						fontSize: {
							xs: '1.8rem', // Font size for extra-small screens and up
							sm: '2.125rem', // Default h4 size for small screens and up
						},
					}}
				>
					My Tasks
				</Typography>
				<AddTaskForm />
				<TaskList />
			</Box>
		</Container>
	);
};

export default HomePage;
