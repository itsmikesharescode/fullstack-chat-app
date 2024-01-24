import {z} from "zod";

export const loginSchema = z.object({
    email: z.string().email({message: "Must enter a valid email."}),
    password: z.string().min(1, {message: "Must enter a password."}),
});

export const registerSchema = z.object({
    display_name: z.string().min(4, {message: "Display name must be at least 4 char long."}),
    email: z.string().email({message: "Must enter a valid email."}),
    password: z.string().min(8, {message: "Password must be at least 8 char long."}),
    confirm_password: z.string().min(1, {message: "Must confirm your password."}),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email({message: "Must enter a valid email."}),
});
