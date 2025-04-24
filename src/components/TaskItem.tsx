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

type TaskStatus = Task['status'];

interface TaskItemProps {
	task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
	const queryClient = useQueryClient();

	const { mutate: updateStatusMutate, isPending: isUpdating } = useMutation({
		mutationFn: (payload: TaskStatusUpdatePayload) =>
			apiUpdateTaskStatus(task._id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] });
		},
	});

	const { mutate: deleteTaskMutate, isPending: isDeleting } = useMutation({
		mutationFn: () => apiDeleteTask(task._id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] });
		},
	});

	const handleStatusChange = (event: SelectChangeEvent<TaskStatus>) => {
		const newStatus = event.target.value as TaskStatus;
		const payload: TaskStatusUpdatePayload = { status: newStatus };
		updateStatusMutate(payload);
	};

	const handleDelete = () => {
		if (
			window.confirm(`Are you sure you want to delete task: "${task.title}"?`)
		) {
			deleteTaskMutate();
		}
	};

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
				{}
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
