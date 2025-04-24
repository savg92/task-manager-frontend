import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../store/authStore';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute: React.FC = () => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isInitialized = useAuthStore((state) => state.isInitialized);

	// Wait until the auth state is initialized
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

	// Once initialized, check authentication
	if (!isAuthenticated) {
		return (
			<Navigate
				to='/login'
				replace
			/>
		);
	}

	// Render child route if initialized and authenticated
	return <Outlet />;
};

export default ProtectedRoute;
