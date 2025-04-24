import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../store/authStore';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute: React.FC = () => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isInitialized = useAuthStore((state) => state.isInitialized);

	if (!isInitialized) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	if (!isAuthenticated) {
		return (
			<Navigate
				to='/login'
				replace
			/>
		);
	}

	return <Outlet />;
};

export default ProtectedRoute;
