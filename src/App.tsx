import { useEffect } from 'react'; // Import useEffect
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import AppRouter from './routes/AppRouter';
import { useAuthStore } from './store/authStore'; // Import the auth store

// Optional: Define a basic MUI theme
const theme = createTheme({
	palette: {
		mode: 'light', // or 'dark'
	},
});

function App() {
	// Get the initializeAuth action and isInitialized flag
	const initializeAuth = useAuthStore((state) => state.initializeAuth);
	const isInitialized = useAuthStore((state) => state.isInitialized);

	// Run initialization only once on component mount
	useEffect(() => {
		initializeAuth();
	}, [initializeAuth]);

	// Optional: Show a loading indicator until auth is initialized
	if (!isInitialized) {
		// You can return a loading spinner or null here
		return <div>Loading...</div>; // Or your preferred loading component
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AppRouter />
		</ThemeProvider>
	);
}

export default App;
