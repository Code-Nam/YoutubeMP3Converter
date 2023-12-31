import * as z from "zod"

export const converterSchema = z.object({
  YTLink: z.string().min(2),
})