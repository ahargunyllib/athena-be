import { z } from 'zod';

export const updateUserSchema = z.object({
  fullName: z.string(),
  email: z.string().email('Invalid email'),
})

export type UpdateUserDtoType = z.infer<typeof updateUserSchema>

export class UpdateUserDto {
  fullName?: string
  email?: string

  constructor(data: UpdateUserDtoType) {
    if (data.fullName) this.fullName = data.fullName
    if (data.email) this.email = data.email
  }
}
