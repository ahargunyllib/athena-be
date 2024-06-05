import { z } from "zod";

export const userTokenSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  fullName: z.string().min(1, "Full name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  dateOfBirth: z.date(),
  phoneNumber: z.string().min(1, "Phone number is required"),
});

export type UserTokenDtoType = z.infer<typeof userTokenSchema>;

export class UserTokenDTO {
  userId: string;
  fullName: string;
  username: string;
  email: string;
  dateOfBirth: Date;
  phoneNumber: string;

  constructor(data: UserTokenDtoType) {
    this.userId = data.userId;
    this.fullName = data.fullName;
    this.username = data.username;
    this.email = data.email;
    this.dateOfBirth = data.dateOfBirth;
    this.phoneNumber = data.phoneNumber;
  }
}