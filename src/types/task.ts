export interface Task {
	_id: string;
	userId: string;
	title: string;
	description?: string;
	status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
	createdAt: number;
	updatedAt: number;
}

export type TaskCreatePayload = Omit<
	Task,
	'_id' | 'userId' | 'createdAt' | 'updatedAt'
>;

export interface TaskStatusUpdatePayload {
	status: Task['status'];
}
