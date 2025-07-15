export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Project {
  id: string;
  _id?: string; // MongoDB ID (opcional para compatibilidad)
  name: string;
  project_key: string;
  description: string;
  owner_id: string;
  members: string[];
  created_at: string;
  updated_at: string;
}

export enum TaskStatus {
  ToDo = "ToDo",
  InProgress = "InProgress",
  Done = "Done",
  Cancelled = "Cancelled",
}

export enum TaskPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Urgent = "Urgent",
}

// export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export interface Task {
  id: string;
  title: string;
  description?: string;
  project_key?: string;
  project_id: string;
  reporter_id: string;
  assignee_id?: string;
  status: TaskStatus;
  priority: TaskPriority | string; // Permitir string para compatibilidad hacia atrás
  start_date?: string; // Fecha de inicio opcional
  end_date?: string; // Fecha final opcional
  created_at: string;
  updated_at: string;
}

export interface CommentAuthor {
  id: string;
  username: string;
  email: string;
}

export interface Comment {
  id: string;
  task_id: string;
  author: CommentAuthor;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface TaskDateRange {
  task_id: string;
  start_date?: string;
  end_date?: string;
}

export interface TaskWithDateRange {
  task: Task;
  date_range?: TaskDateRange;
}

export {};
