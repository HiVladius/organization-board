import {z} from 'zod';


export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})


export const createProjectSchema = z.object({
    name: z.string().min(3, {message: "El nombre debe de tener al menos 3 caracteres"}),
    key: z
        .string().regex(/^[A-Z0-9]+$/, {message: "La clave solo puede contener letras mayúsculas y números"})
        .min(2, {message: "La clave debe de tener al menos 2 caracteres"})
        .max(10, {message: "La clave debe de tener como máximo 10 caracteres"}),
        description: z.string().optional(), 
        
})

export type TLoginSchema = z.infer<typeof loginSchema>;
export type TCreateProjectSchema = z.infer<typeof createProjectSchema>;