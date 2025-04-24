import axios from 'axios';
import {
	Task,
	TaskCreatePayload,
	TaskStatusUpdatePayload,
} from '../types/task';
import { UserCredentials, AuthResponse, User } from '../types/user';

const API_BASE_PATH = '/api';

const apiClient = axios.create({
	baseURL: API_BASE_PATH,
	headers: {
		'Content-Type': 'application/json',
	},
});

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

export const registerUser = async (
	credentials: UserCredentials
): Promise<AuthResponse> => {
	const response = await apiClient.post<AuthResponse>('/register', credentials);

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
    const response = await apiClient.post<{
      access_token?: string;
      token?: string;
      token_type?: string;
      user?: User;
    }>('/login', credentials);
    console.log('[loginUser] Login API response received:', response.data);

    const data = response.data;
    const authToken = data.access_token ?? data.token;
    if (!authToken) {
      throw new Error('[loginUser] No token received in login response.');
    }

    localStorage.setItem('authToken', authToken);
    console.log('[loginUser] Token stored in localStorage.');

    return {
      token: authToken,
      user: data.user ?? null,
      message: 'Login successful',
    };
  } catch (error) {
    console.error('[loginUser] Login API error:', error);
    throw error;
  }
};

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
