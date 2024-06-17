import { z } from "zod";

export const messageSchema = z.object({
  content: z.string().min(1, "Message must not be empty"),
  type: z.enum(["text", "image", "video", "audio", "location"]),
})