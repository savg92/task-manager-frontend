import { useQuery } from '@tanstack/react-query';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { getTasks } from '../services/api';
import TaskItem from './TaskItem';

const TaskList: React.FC = () => {
	// Use React Query to fetch tasks
	const {
		data: tasks,
		error,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['tasks'], // Unique key for this query
		queryFn: getTasks, // The function to fetch data
	});

	if (isLoading) {
		// Use isLoading from useQuery
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '50vh',
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	if (isError) {
		// Use isError and error from useQuery
		return (
			<Alert
				severity='error'
				sx={{ mt: 2 }}
			>
				{error?.message || 'Failed to fetch tasks'}
			</Alert>
		);
	}

	if (!tasks || tasks.length === 0) {
		// Check tasks data directly
		return (
			<Typography sx={{ mt: 2, textAlign: 'center' }}>
				No tasks found. Add one!
			</Typography>
		);
	}

	return (
		<Box sx={{ mt: 2 }}>
			{tasks.map((task) => (
				<TaskItem
					key={task._id}
					task={task}
				/>
			))}
		</Box>
	);
};

export default TaskList;
