import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Container, Box, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuthStore } from '../store/authStore';
import AuthForm from '../components/AuthForm';
import { UserCredentials } from '../types/user';

const LoginPage: React.FC = () => {
	const navigate = useNavigate();

	// Select state properties individually to prevent unnecessary re-renders
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const loading = useAuthStore((state) => state.loading);
	const error = useAuthStore((state) => state.error);

	// Select the login action directly from the store
	const login = useAuthStore((state) => state.login);

	useEffect(() => {
		// Redirect if already authenticated
		if (isAuthenticated) {
			navigate('/'); // Redirect to home page
		}
	}, [isAuthenticated, navigate]);

	const handleLogin = async (
		credentials: Pick<UserCredentials, 'email' | 'password'>
	) => {
		// Use the selected login action
		await login(credentials);
		// Navigation on success is handled by the useEffect hook
	};

	return (
		<Container
			component='main'
			maxWidth='xs'
		>
			{' '}
			{/* Use xs for small forms */}
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				{/* You can add an Avatar or Logo here if desired */}
				<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
					<LockOutlinedIcon />
				</Avatar>
				<AuthForm
					formType='login'
					onSubmit={handleLogin}
					loading={loading}
					error={error}
				/>
			</Box>
		</Container>
	);
};

export default LoginPage;
