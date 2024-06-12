import { z } from 'zod'

export const updateLocationSchema = z.object({
  latitude: z.number().min(-90, 'Latitude must be at least -90').max(90, 'Latitude must be at most 90'),
  longitude: z.number().min(-180, 'Longitude must be at least -180').max(180, 'Longitude must be at most 180'),
})

export type UpdateLocationDtoType = z.infer<typeof updateLocationSchema>

export class UpdateLocationDto {
  latitude: number
  longitude: number

  constructor(data: UpdateLocationDtoType) {
    this.latitude = data.latitude
    this.longitude = data.longitude
  }
}