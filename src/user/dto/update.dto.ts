import {z} from 'zod';

export const updateUserSchema = z.object({
  fullName: z.string().optional(),
  username: z.string().optional(),
  dateOfBirth: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export type UpdateUserDtoType = z.infer<typeof updateUserSchema>;

export class UpdateUserDto {
  fullName: string;
  username: string;
  dateOfBirth: string;
  phoneNumber: string;

  constructor(data: UpdateUserDtoType) {
    this.fullName = data.fullName;
    this.username = data.username;
    this.dateOfBirth = data.dateOfBirth;
    this.phoneNumber = data.phoneNumber;
  }
}

export const updateCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type UpdateCredentialsDtoType = z.infer<typeof updateCredentialsSchema>;

export class UpdateCredentialsDto {
  email: string;
  password: string;

  constructor(data: UpdateCredentialsDtoType) {
    this.email = data.email;
    this.password = data.password;
  }
}