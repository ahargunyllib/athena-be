import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginDtoType = z.infer<typeof loginSchema>;

export class LoginDto {
  email: string;
  password: string;

  constructor(data: LoginDtoType) {
    this.email = data.email;
    this.password = data.password;
  }
}