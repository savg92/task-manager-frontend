import React, { useState } from 'react';
import {
	Box,
	TextField,
	Button,
	CircularProgress,
	Alert,
	Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../services/api';
import { TaskCreatePayload } from '../types/task';

const AddTaskForm: React.FC = () => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [formError, setFormError] = useState<string | null>(null);

	// Get QueryClient instance
	const queryClient = useQueryClient();

	// Use React Query's useMutation for adding tasks
	const {
		mutate: addTaskMutate,
		isPending: loading,
		error,
	} = useMutation({
		mutationFn: createTask, // The function to call for the mutation
		onSuccess: () => {
			// Invalidate the 'tasks' query to refetch data after successful addition
			queryClient.invalidateQueries({ queryKey: ['tasks'] });
			// Clear form on successful submission
			setTitle('');
			setDescription('');
			setFormError(null);
		},
		onError: (err) => {
			// Error is available in the `error` variable from useMutation
			console.error('Failed to add task:', err);
			// Optionally set a form-specific error message
			// setFormError("Failed to add task. Please try again.");
		},
	});

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		setFormError(null); // Clear previous form error

		if (!title.trim()) {
			setFormError('Title is required.');
			return;
		}

		const newTask: TaskCreatePayload = {
			title: title.trim(),
			description: description.trim() || undefined, // Send undefined if empty
			status: 'TODO', // Default status
		};

		// Call the mutation function
		addTaskMutate(newTask);
	};

	return (
		<Box
			component='form'
			onSubmit={handleSubmit}
			sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
			noValidate
			autoComplete='off'
		>
			<Typography variant='h6'>Add New Task</Typography>
			{formError && <Alert severity='warning'>{formError}</Alert>}
			{/* Display error from the mutation hook */}
			{error && <Alert severity='error'>{error.message}</Alert>}
			<TextField
				label='Title'
				variant='outlined'
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				required
				fullWidth
				disabled={loading}
			/>
			<TextField
				label='Description (Optional)'
				variant='outlined'
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				multiline
				rows={3}
				fullWidth
				disabled={loading}
			/>
			<Button
				type='submit'
				variant='contained'
				disabled={loading || !title.trim()} // Disable if loading or title is empty
				sx={{
					// Make button full width on small screens, align start on larger screens
					width: { xs: '100%', sm: 'auto' },
					alignSelf: { xs: 'stretch', sm: 'flex-start' },
				}}
			>
				{loading ? <CircularProgress size={24} /> : 'Add Task'}
			</Button>
		</Box>
	);
};

export default AddTaskForm;
