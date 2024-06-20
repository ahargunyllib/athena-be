import { z } from 'zod'

export const createReportSchema = z.object({
  reason: z.string().min(1, 'Reason must not be empty'),
})

export type CreateReportDtoType = z.infer<typeof createReportSchema>

export class createReportDto {
  reason: string

  constructor(data: CreateReportDtoType) {
    this.reason = data.reason
  }
}
