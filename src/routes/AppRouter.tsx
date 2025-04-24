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
			<Navbar /> {}
			<Routes>
				<Route
					path='/login'
					element={<LoginPage />}
				/>
				<Route
					path='/register'
					element={<RegisterPage />}
				/>

				{}
				<Route element={<ProtectedRoute />}>
					<Route
						path='/'
						element={<HomePage />}
					/>
					<Route
						path='/charts'
						element={<ChartPage />}
					/>
					{}
				</Route>

				{}
				<Route
					path='*'
					element={<div>404 Not Found</div>}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default AppRouter;
