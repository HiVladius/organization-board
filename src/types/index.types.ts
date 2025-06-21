export interface User{
    id: string;
    username: string;
    email: string;
}

export interface Project {
    id: string | number;
    name: string,
    project_key: string,
    description: string,
    owner_id: string,
    members: string[],
    created_at: string,
    updated_at: string,
}