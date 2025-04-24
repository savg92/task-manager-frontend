export interface User {
	// Define if needed, maybe just store token and basic info like email/id
	id: string;
	email?: string;
}

export interface UserCredentials {
	email: string;
	password?: string; // Password might not always be needed (e.g., fetching user data)
	username?: string; // For registration
}

export interface AuthResponse {
	token: string;
	user: User | null; // Allow user to be null
	message?: string; // Optional message (e.g., success/error)
}
