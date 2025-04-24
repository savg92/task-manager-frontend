export interface User {
	id: string;
	email?: string;
}

export interface UserCredentials {
	email: string;
	password?: string;
	username?: string;
}

export interface AuthResponse {
	token: string;
	user: User | null;
	message?: string;
}
