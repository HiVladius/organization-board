export interface User {
    id: string,
    username: string,
    email: string,
}

export interface Project {
    id: string,
    _id?: string, // MongoDB ID (opcional para compatibilidad)
    name: string,
    project_key: string,
    description: string,
    owner_id: string,
    members: string[],
    created_at: string,
    updated_at: string,
}

// export const TaskStatus = {
//     ToDo: "ToDo",
//     InProgress: "InProgress", 
//     Done: "Done",
//     Canceled: "Canceled"
// } as const;

export enum TaskStatus {
    ToDo = "ToDo",
    InProgress = "InProgress",
    Done = "Done",
    Canceled = "Canceled"
}

// export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export interface Task {
  id: string;
  title: string;
  description?: string;
  project_id: string;
  reporter_id: string;
  assignee_id?: string;
  status: TaskStatus;
  priority: string; // Podríamos hacer un enum para esto también
  created_at: string;
  updated_at: string;
}


export {};