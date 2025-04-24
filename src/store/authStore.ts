import { create } from 'zustand';
import { UserCredentials, User, AuthResponse } from '../types/user';
import { loginUser, registerUser } from '../services/api';
import api from '../services/api';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	loading: boolean;
	error: string | null;
	isInitialized: boolean;
}

export interface AuthActions {
	login: (
		credentials: Pick<UserCredentials, 'email' | 'password'>
	) => Promise<void>;
	register: (credentials: UserCredentials) => Promise<void>;
	logout: () => void;
	clearError: () => void;
	initializeAuth: () => void;
}

export type AuthStore = AuthState & AuthActions;

const isTokenValid = (token: string): { valid: boolean; user: User | null } => {
	// console.log('[isTokenValid] Checking token:', token);
	if (!token) {
		// console.log('[isTokenValid] No token provided.');
		return { valid: false, user: null };
	}
	try {
		const decoded: {
			sub: string;
			email?: string;
			username?: string;
			exp?: number;
		} = jwtDecode(token);
		// console.log('[isTokenValid] Decoded token:', decoded);

		if (decoded.exp && decoded.exp * 1000 < Date.now()) {
			// console.log('[isTokenValid] Token expired.');
			localStorage.removeItem('authToken');
			return { valid: false, user: null };
		}

		const userResult: User = {
			id: decoded.sub,
			email: decoded.email,
		};
		// console.log('[isTokenValid] Token is valid. User:', userResult);
		return { valid: true, user: userResult };
	} catch (error) {
		console.error('[isTokenValid] Invalid token error:', error);
		localStorage.removeItem('authToken');
		return { valid: false, user: null };
	}
};

export const useAuthStore = create<AuthStore>((set, get) => ({
	isAuthenticated: false,
	user: null,
	loading: false,
	error: null,
	isInitialized: false,

	initializeAuth: () => {
		// console.log('[initializeAuth] Starting initialization...');
		if (get().isInitialized) {
			// console.log('[initializeAuth] Already initialized.');
			return;
		}

		const token = localStorage.getItem('authToken');
		// console.log('[initializeAuth] Token from localStorage:', token);

		if (token) {
			const { valid, user } = isTokenValid(token);
			// console.log('[initializeAuth] Token validation result:', { valid, user });
			if (valid && user) {
				// console.log('[initializeAuth] Setting authenticated state.');
				api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
				set({
					isAuthenticated: true,
					user: user,
					isInitialized: true,
					loading: false,
					error: null,
				});
				// console.log('[initializeAuth] State after setting auth:', get());
				return;
			}
		}

		// console.log('[initializeAuth] Setting unauthenticated state.');
		set({
			isAuthenticated: false,
			user: null,
			isInitialized: true,
			loading: false,
			error: null,
		});
		// console.log('[initializeAuth] State after setting no auth:', get());
	},

	login: async (credentials) => {
		// console.log(
		// 	'[AuthStore.login] Starting login action for:',
		// 	credentials.email
		// );
		set({ loading: true, error: null });
		try {
			const authResponse: AuthResponse = await loginUser(credentials);
			// console.log(
			// 	'[AuthStore.login] loginUser call successful. Response:',
			// 	authResponse
			// );

			const token = localStorage.getItem('authToken');
			// console.log(
			// 	'[AuthStore.login] Token from localStorage immediately after loginUser:',
			// 	token
			// );

			if (token) {
				// console.log(
				// 	'[AuthStore.login] Token found. Setting authenticated state in store.'
				// );

				let user: User | null = authResponse.user;
				if (!user) {
					try {
						const decoded: { sub: string; email?: string; username?: string } =
							jwtDecode(token);
						user = {
							id: decoded.sub,
							email: decoded.email,
						};
						// console.log(
						// 	'[AuthStore.login] User info extracted from token:',
						// 	user
						// );
					} catch (decodeError) {
						console.error(
							'[AuthStore.login] Failed to decode token after login:',
							decodeError
						);

						user = null;
					}
				}

				set({
					isAuthenticated: true,
					user: user,
					loading: false,
					error: null,
				});
				// console.log('[AuthStore.login] State after setting auth:', get());
			} else {
				// console.error(
				// 	'[AuthStore.login] Login succeeded but token missing after loginUser call.'
				// );
				set({
					isAuthenticated: false,
					user: null,
					loading: false,
					error: 'Login completed but token was not processed correctly.',
				});
			}
		} catch (err) {
			// console.error('[AuthStore.login] Error during login action:', err);
			let message = 'Login failed';
			if (axios.isAxiosError(err) && err.response) {
				message = err.response.data?.message || err.message;
			} else if (err instanceof Error) {
				message = err.message;
			}
			set({
				error: message,
				loading: false,
				isAuthenticated: false,
				user: null,
			});
		}
	},

	register: async (credentials) => {
		set({ loading: true, error: null });
		try {
			await registerUser(credentials);
			set({ loading: false });
		} catch (err) {
			let message = 'Registration failed';
			if (axios.isAxiosError(err) && err.response) {
				message = err.response.data?.message || err.message;
			} else if (err instanceof Error) {
				message = err.message;
			}
			set({ error: message, loading: false });

			throw err;
		}
	},

	logout: () => {
		localStorage.removeItem('authToken');
		delete api.defaults.headers.common['Authorization'];
		set({ isAuthenticated: false, user: null, error: null, loading: false });
	},

	clearError: () => {
		set({ error: null });
	},
}));
