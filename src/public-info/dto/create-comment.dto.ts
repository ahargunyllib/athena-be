import { z } from 'zod'

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Content must not be empty'),
})

export type CreateCommentDtoType = z.infer<typeof createCommentSchema>

export class CreateCommentDto {
  content: string

  constructor(data: CreateCommentDtoType) {
    this.content = data.content
  }
}
