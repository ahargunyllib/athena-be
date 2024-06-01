import { z } from 'zod'

export const createUserSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type CreateUserDtoType = z.infer<typeof createUserSchema>

export class CreateUserDto {
  fullName: string
  email: string
  password: string

  constructor(data: CreateUserDtoType) {
    this.fullName = data.fullName
    this.email = data.email
    this.password = data.password
  }
}
