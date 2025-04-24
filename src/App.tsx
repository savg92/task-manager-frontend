import { useEffect } from 'react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import AppRouter from './routes/AppRouter';
import { useAuthStore } from './store/authStore';

const theme = createTheme({
	palette: {
		mode: 'light',
	},
});

function App() {
	const initializeAuth = useAuthStore((state) => state.initializeAuth);
	const isInitialized = useAuthStore((state) => state.isInitialized);

	useEffect(() => {
		initializeAuth();
	}, [initializeAuth]);

	if (!isInitialized) {
		return <div>Loading...</div>;
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AppRouter />
		</ThemeProvider>
	);
}

export default App;
