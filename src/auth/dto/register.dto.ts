import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterDtoType = z.infer<typeof registerSchema>;

export class RegisterDto {
  fullName: string;
  username: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  password: string;

  constructor(data: RegisterDtoType) {
    this.fullName = data.fullName;
    this.username = data.username;
    this.email = data.email;
    this.dateOfBirth = data.dateOfBirth;
    this.phoneNumber = data.phoneNumber;
    this.password = data.password;
  }
}