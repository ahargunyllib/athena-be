import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterDtoType = z.infer<typeof registerSchema>;

export class RegisterDto {
  fullName: string;
  email: string;
  password: string;

  constructor(data: RegisterDtoType) {
    this.fullName = data.fullName;
    this.email = data.email;
    this.password = data.password;
  }
}