import React, { useMemo } from 'react';
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../services/api';
import { Task } from '../types/task';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';

const COLORS = {
	TODO: '#FFBB28',
	IN_PROGRESS: '#00C49F',
	COMPLETED: '#0088FE',
};

const TaskChart: React.FC = () => {
	const {
		data: tasks,
		error,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['tasks'],
		queryFn: getTasks,
	});

	const chartData = useMemo(() => {
		if (!tasks) return [];
		const counts: { [key in Task['status']]: number } = {
			TODO: 0,
			IN_PROGRESS: 0,
			COMPLETED: 0,
		};

		tasks.forEach((task) => {
			counts[task.status]++;
		});

		return Object.entries(counts)
			.map(([name, value]) => ({
				name: name.replace('_', ' '),
				value,
			}))
			.filter((item) => item.value > 0);
	}, [tasks]);

	if (isLoading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (isError) {
		return (
			<Alert
				severity='error'
				sx={{ mt: 4 }}
			>
				{error?.message || 'Failed to load chart data'}
			</Alert>
		);
	}

	if (!tasks || tasks.length === 0) {
		return (
			<Paper
				elevation={3}
				sx={{ p: 3, mt: 4, textAlign: 'center' }}
			>
				<Typography
					variant='h6'
					gutterBottom
				>
					Task Status Distribution
				</Typography>
				<Typography color='text.secondary'>
					No tasks available to display chart.
				</Typography>
			</Paper>
		);
	}

	if (chartData.length === 0) {
		return (
			<Paper
				elevation={3}
				sx={{ p: 3, mt: 4, textAlign: 'center' }}
			>
				<Typography
					variant='h6'
					gutterBottom
				>
					Task Status Distribution
				</Typography>
				<Typography color='text.secondary'>
					No task data to display in chart.
				</Typography>
			</Paper>
		);
	}

	return (
		<Paper
			elevation={3}
			sx={{ p: 3, mt: 4 }}
		>
			<Typography
				variant='h6'
				gutterBottom
				align='center'
			>
				Task Status Distribution
			</Typography>
			<Box sx={{ width: '100%', height: 300 }}>
				<ResponsiveContainer>
					<PieChart>
						<Pie
							data={chartData}
							cx='50%'
							cy='50%'
							labelLine={false}
							outerRadius={80}
							fill='#8884d8'
							dataKey='value'
							label={({ name, percent }) =>
								`${name} (${(percent * 100).toFixed(0)}%)`
							}
						>
							{chartData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={
										COLORS[entry.name.replace(' ', '_') as keyof typeof COLORS]
									}
								/>
							))}
						</Pie>
						<Tooltip />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</Box>
		</Paper>
	);
};

export default TaskChart;
