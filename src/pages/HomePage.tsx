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
						fontSize: {
							xs: '1.8rem',
							sm: '2.125rem',
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
