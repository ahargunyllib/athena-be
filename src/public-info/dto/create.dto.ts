import { z } from 'zod'

export const createPublicInfoSchema = z.object({
  latitude: z
    .number()
    .min(-90, 'Latitude must be at least -90')
    .max(90, 'Latitude must be at most 90'),
  longitude: z
    .number()
    .min(-180, 'Longitude must be at least -180')
    .max(180, 'Longitude must be at most 180'),
  content: z.string().min(1, 'Content must not be empty'),
})

export type CreatePublicInfoDtoType = z.infer<typeof createPublicInfoSchema>

export class CreatePublicInfoDto {
  latitude: number
  longitude: number
  content: string

  constructor(data: CreatePublicInfoDtoType) {
    this.latitude = data.latitude
    this.longitude = data.longitude
    this.content = data.content
  }
}
