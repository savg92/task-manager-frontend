import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Container, Box, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuthStore } from '../store/authStore';
import AuthForm from '../components/AuthForm';
import { UserCredentials } from '../types/user';

const LoginPage: React.FC = () => {
	const navigate = useNavigate();

	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const loading = useAuthStore((state) => state.loading);
	const error = useAuthStore((state) => state.error);

	const login = useAuthStore((state) => state.login);

	useEffect(() => {
		if (isAuthenticated) {
			navigate('/');
		}
	}, [isAuthenticated, navigate]);

	const handleLogin = async (
		credentials: Pick<UserCredentials, 'email' | 'password'>
	) => {
		await login(credentials);
	};

	return (
		<Container
			component='main'
			maxWidth='xs'
		>
			{' '}
			{}
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				{}
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
