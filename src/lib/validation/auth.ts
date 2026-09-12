import { z } from "zod";

export const userRoleSchema = z.enum(["brand", "creator", "admin"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const signUpSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["brand", "creator"]), // admin accounts are never self-registered
});
export type SignUpInput = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;
