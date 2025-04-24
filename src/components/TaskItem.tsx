import React from 'react';
import {
	Card,
	CardContent,
	Typography,
	Select,
	MenuItem,
	IconButton,
	Box,
	CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { SelectChangeEvent } from '@mui/material/Select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	updateTaskStatus as apiUpdateTaskStatus,
	deleteTask as apiDeleteTask,
} from '../services/api';
import { Task, TaskStatusUpdatePayload } from '../types/task';

// Define TaskStatus type based on Task['status']
type TaskStatus = Task['status'];

interface TaskItemProps {
	task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
	const queryClient = useQueryClient();

	// Mutation for updating task status
	const { mutate: updateStatusMutate, isPending: isUpdating } = useMutation({
		mutationFn: (payload: TaskStatusUpdatePayload) =>
			apiUpdateTaskStatus(task._id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] });
		},
		// Optional: Add onError handling
	});

	// Mutation for deleting a task
	const { mutate: deleteTaskMutate, isPending: isDeleting } = useMutation({
		mutationFn: () => apiDeleteTask(task._id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] });
		},
		// Optional: Add onError handling
	});

	const handleStatusChange = (event: SelectChangeEvent<TaskStatus>) => {
		const newStatus = event.target.value as TaskStatus;
		const payload: TaskStatusUpdatePayload = { status: newStatus };
		updateStatusMutate(payload); // Call the update mutation
	};

	const handleDelete = () => {
		if (
			window.confirm(`Are you sure you want to delete task: "${task.title}"?`)
		) {
			deleteTaskMutate(); // Call the delete mutation
		}
	};

	// Combine loading states
	const isProcessing = isUpdating || isDeleting;

	return (
		<Card sx={{ mb: 2, opacity: isProcessing ? 0.7 : 1 }}>
			<CardContent>
				<Box
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'row' },
						justifyContent: 'space-between',
						alignItems: { xs: 'flex-start', sm: 'center' },
						gap: 1,
					}}
				>
					<Typography
						variant='h6'
						component='div'
						sx={{ flexGrow: 1, mr: { sm: 2 }, wordBreak: 'break-word' }}
					>
						{task.title}
					</Typography>
					{isProcessing ? (
						<CircularProgress
							size={24}
							sx={{ alignSelf: 'center' }}
						/>
					) : (
						<Box
							sx={{
								display: 'flex',
								flexDirection: { xs: 'row', sm: 'row' },
								alignItems: 'center',
								gap: 1,
								width: { xs: '100%', sm: 'auto' },
								justifyContent: { xs: 'space-between', sm: 'flex-end' },
							}}
						>
							<Select
								value={task.status}
								onChange={handleStatusChange}
								size='small'
								sx={{ minWidth: 120, flexGrow: { xs: 1, sm: 0 } }}
								disabled={isProcessing}
							>
								<MenuItem value={'TODO' satisfies TaskStatus}>To Do</MenuItem>
								<MenuItem value={'IN_PROGRESS' satisfies TaskStatus}>
									In Progress
								</MenuItem>
								<MenuItem value={'COMPLETED' satisfies TaskStatus}>
									Completed
								</MenuItem>
							</Select>
							<IconButton
								aria-label='delete'
								onClick={handleDelete}
								disabled={isProcessing}
								color='error'
							>
								<DeleteIcon />
							</IconButton>
						</Box>
					)}
				</Box>
				{/* Optional: Display description if it exists */}
				{task.description && (
					<Typography
						variant='body2'
						color='text.secondary'
						sx={{ mt: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
					>
						{task.description}
					</Typography>
				)}
			</CardContent>
		</Card>
	);
};

export default TaskItem;
