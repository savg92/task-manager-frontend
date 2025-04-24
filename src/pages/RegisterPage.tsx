import React, { useEffect } from 'react';
import { Container, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router';
import AuthForm from '../components/AuthForm';
import { useAuthStore } from '../store/authStore';
import { UserCredentials } from '../types/user';

const RegisterPage: React.FC = () => {
	const navigate = useNavigate();

	const register = useAuthStore((state) => state.register);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const loading = useAuthStore((state) => state.loading);
	const error = useAuthStore((state) => state.error);
	const clearError = useAuthStore((state) => state.clearError);

	const [registrationSuccess, setRegistrationSuccess] = React.useState(false);

	useEffect(() => {
		clearError();
		return () => {
			clearError();
		};
	}, [clearError]);

	useEffect(() => {
		if (isAuthenticated) {
			navigate('/');
		}
	}, [isAuthenticated, navigate]);

	const handleRegister = async (credentials: UserCredentials) => {
		setRegistrationSuccess(false);
		try {
			await register(credentials);

			setRegistrationSuccess(true);
			setTimeout(() => {
				navigate('/login');
			}, 2000);
		} catch (err) {
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
				{}
				{registrationSuccess && (
					<Alert
						severity='success'
						sx={{ width: '100%', mb: 2 }}
					>
						Registration successful! You can now log in.
						{}
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
