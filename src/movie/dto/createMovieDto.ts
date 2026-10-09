import { z } from 'zod'

export const createMovieSchema = z.object({
    title: z.string().min(3).max(255),
    description: z.string().min(8).max(5000),
    img: z.httpUrl(),
    categoryIds: z.array(z.number())
})

export type CreateMovieDto = z.infer<typeof createMovieSchema>