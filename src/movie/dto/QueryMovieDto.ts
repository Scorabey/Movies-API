import { z } from "zod"
 
export const queryMovieSchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    page: z.coerce.number().int().min(0).default(0),
    sortBy: z.enum(["title"]).default("title"),
    orderBy: z.enum(["asc", "desc"]).default("asc"),
    search: z.string().optional(),
    filterBy: z.union([z.string(), z.array(z.string())]).optional()
        .transform((v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]))
})

export type QueryMovieDto = z.infer<typeof queryMovieSchema>