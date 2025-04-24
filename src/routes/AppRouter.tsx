import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ChartPage from '../pages/ChartPage';
import ProtectedRoute from './ProtectedRoute';
import Navbar from '../components/Navbar'; 

const AppRouter: React.FC = () => {
	return (
		<BrowserRouter>
			<Navbar /> {/* Render Navbar on all pages */}
			<Routes>
				<Route
					path='/login'
					element={<LoginPage />}
				/>
				<Route
					path='/register'
					element={<RegisterPage />}
				/>

				{/* Protected Routes */}
				<Route element={<ProtectedRoute />}>
					<Route
						path='/'
						element={<HomePage />}
					/>
					<Route
						path='/charts'
						element={<ChartPage />}
					/>
					{/* Add other protected routes here */}
				</Route>

				{/* Optional: Add a 404 Not Found route */}
				<Route
					path='*'
					element={<div>404 Not Found</div>}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default AppRouter;
