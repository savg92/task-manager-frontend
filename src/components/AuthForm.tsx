import React, { useState } from 'react';
import {
	Box,
	TextField,
	Button,
	Typography,
	CircularProgress,
	Alert,
} from '@mui/material';
import { UserCredentials } from '../types/user';

interface AuthFormProps {
	formType: 'login' | 'register';
	onSubmit: (credentials: UserCredentials) => Promise<void>; // Make async to handle loading/errors
	loading: boolean;
	error: string | null;
}

const AuthForm: React.FC<AuthFormProps> = ({
	formType,
	onSubmit,
	loading,
	error,
}) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState(''); // Only for registration
	const [formError, setFormError] = useState<string | null>(null);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setFormError(null); // Clear previous form error

		if (!email || !password || (formType === 'register' && !username)) {
			setFormError('Please fill in all required fields.');
			return;
		}
		if (!/\S+@\S+\.\S+/.test(email)) {
			setFormError('Please enter a valid email address.');
			return;
		}
		if (password.length < 6) {
			// Example basic validation
			setFormError('Password must be at least 6 characters long.');
			return;
		}

		const credentials: UserCredentials = {
			email,
			password,
			...(formType === 'register' && { username }), // Add username only for registration
		};

		try {
			await onSubmit(credentials);
			// On successful login/register, navigation should happen in the page component
			// calling this form, based on the store state change.
		} catch (err) {
			// Error is handled by the parent component/store, but we could log it
			console.error(`${formType} failed:`, err);
			// The `error` prop will display the error from the store
		}
	};

	return (
		<Box
			component='form'
			onSubmit={handleSubmit}
			sx={{
				mt: 1,
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				width: '100%',
				maxWidth: '400px',
			}} // Limit form width
			noValidate
			autoComplete='off'
		>
			<Typography
				variant='h5'
				component='h1'
				gutterBottom
			>
				{formType === 'login' ? 'Login' : 'Register'}
			</Typography>
			{formError && <Alert severity='warning'>{formError}</Alert>}
			{error && <Alert severity='error'>{error}</Alert>}
			{formType === 'register' && (
				<TextField
					label='Username'
					variant='outlined'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
					fullWidth
					disabled={loading}
					autoComplete='username'
				/>
			)}
			<TextField
				label='Email Address'
				variant='outlined'
				type='email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
				fullWidth
				disabled={loading}
				autoComplete='email'
			/>
			<TextField
				label='Password'
				variant='outlined'
				type='password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
				fullWidth
				disabled={loading}
				autoComplete={
					formType === 'login' ? 'current-password' : 'new-password'
				}
			/>
			<Button
				type='submit'
				variant='contained'
				fullWidth
				disabled={
					loading ||
					!email ||
					!password ||
					(formType === 'register' && !username)
				}
				sx={{ mt: 2 }}
			>
				{loading ? (
					<CircularProgress size={24} />
				) : formType === 'login' ? (
					'Login'
				) : (
					'Register'
				)}
			</Button>
		</Box>
	);
};

export default AuthForm;
