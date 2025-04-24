import React, { useEffect } from 'react';
import { Container, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router';
import AuthForm from '../components/AuthForm';
import { useAuthStore } from '../store/authStore';
import { UserCredentials } from '../types/user';

const RegisterPage: React.FC = () => {
	const navigate = useNavigate();

	// Select state and actions individually
	const register = useAuthStore((state) => state.register);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const loading = useAuthStore((state) => state.loading);
	const error = useAuthStore((state) => state.error);
	const clearError = useAuthStore((state) => state.clearError);

	const [registrationSuccess, setRegistrationSuccess] = React.useState(false);

	useEffect(() => {
		// Clear errors when component mounts or unmounts
		clearError();
		return () => {
			clearError();
		};
	}, [clearError]);

	useEffect(() => {
		// Redirect if already authenticated (e.g., after successful registration)
		if (isAuthenticated) {
			// Optional: Show success message briefly before redirecting
			// setTimeout(() => navigate('/'), 1500); // Delay redirect
			navigate('/'); // Redirect immediately
		}
	}, [isAuthenticated, navigate]);

	const handleRegister = async (credentials: UserCredentials) => {
		setRegistrationSuccess(false); // Reset success message
		try {
			await register(credentials);
			// Assuming registration does NOT automatically log the user in.
			// Show success message and then redirect to login.
			setRegistrationSuccess(true);
			setTimeout(() => {
				navigate('/login');
			}, 2000); // Redirect to login page after 2 seconds

		} catch (err) {
			// Error is handled by the store and displayed via the error prop in AuthForm
			console.error('Registration failed:', err);
			setRegistrationSuccess(false);
		}
	};

	return (
		<Container
			component='main'
			maxWidth='xs'
		>
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				{/* Similar structure to LoginPage */}
				{registrationSuccess && (
					<Alert
						severity='success'
						sx={{ width: '100%', mb: 2 }}
					>
						Registration successful! You can now log in.
						{/* Or redirect to login: navigate('/login'); */}
					</Alert>
				)}
				<AuthForm
					formType='register'
					onSubmit={handleRegister}
					loading={loading}
					error={error}
				/>
			</Box>
		</Container>
	);
};

export default RegisterPage;
