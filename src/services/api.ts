import axios from 'axios';
import {
	Task,
	TaskCreatePayload,
	TaskStatusUpdatePayload,
} from '../types/task';
import { UserCredentials, AuthResponse, User } from '../types/user'; // Import User type

// const API_URL = 'https://ngte2hwp1k.execute-api.us-east-1.amazonaws.com'; // Original URL
const API_BASE_PATH = '/api'; // Use the proxy path

const apiClient = axios.create({
	// baseURL: API_URL, // Use the proxy path instead of the full URL
	baseURL: API_BASE_PATH,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Add a request interceptor to include the token
apiClient.interceptors.request.use(
	(config) => {
		console.log('[Interceptor] Running for request:', config.url);
		const token = localStorage.getItem('authToken');
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
			console.log('[Interceptor] Authorization header set.');
		} else {
			console.log('[Interceptor] No token found or no headers object.');
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// --- Auth API Calls ---

export const registerUser = async (
	credentials: UserCredentials
): Promise<AuthResponse> => {
	// Assuming the register endpoint returns the same AuthResponse structure as login
	const response = await apiClient.post<AuthResponse>('/register', credentials);
	// Optionally handle token storage here if registration also logs the user in
	if (response.data.token) {
		localStorage.setItem('authToken', response.data.token);
	}
	return response.data;
};

export const loginUser = async (
	credentials: Pick<UserCredentials, 'email' | 'password'>
): Promise<AuthResponse> => {
	console.log('[loginUser] Attempting login for:', credentials.email);
	try {
		// Define the expected response structure from the login endpoint
		const response = await apiClient.post<{
			access_token: string;
			token_type: string;
			user?: User;
		}>('/login', credentials);
		console.log('[loginUser] Login API response received:', response.data);

		// Use access_token from the response
		if (response.data.access_token) {
			console.log('[loginUser] Token received:', response.data.access_token);
			localStorage.setItem('authToken', response.data.access_token);
			console.log('[loginUser] Token stored in localStorage.');
			console.log(
				'[loginUser] Value in localStorage after set:',
				localStorage.getItem('authToken')
			);
		} else {
			console.warn('[loginUser] No access_token received in login response.');
		}

		// Construct the AuthResponse expected by the store
		const authResponse: AuthResponse = {
			token: response.data.access_token, // Map access_token to token
			// If the API doesn't return the full user object on login,
			// decode the token here to get basic user info or set user to null
			// For now, assuming it might return user, or fallback to null
			user: response.data.user || null,
			message: 'Login successful',
		};

		return authResponse;
	} catch (error) {
		console.error('[loginUser] Login API error:', error);
		throw error;
	}
};

// --- Task API Calls ---

export const getTasks = async (): Promise<Task[]> => {
	const response = await apiClient.get<Task[]>('/tasks');
	return response.data;
};

export const createTask = async (
	taskData: TaskCreatePayload
): Promise<Task> => {
	const response = await apiClient.post<Task>('/tasks', taskData);
	return response.data;
};

export const updateTaskStatus = async (
	taskId: string,
	statusUpdate: TaskStatusUpdatePayload
): Promise<Task> => {
	// Assuming the update endpoint returns the updated task
	const response = await apiClient.put<Task>(
		`/tasks/${taskId}/status`,
		statusUpdate
	);
	return response.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
	await apiClient.delete(`/tasks/${taskId}`);
};

export default apiClient;
