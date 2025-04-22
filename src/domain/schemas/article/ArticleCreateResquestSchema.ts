import { z } from "zod";

const createRequestSchema = z.object({
    title: z.string({ message: '[SCHEMA ERROR] - Missing Field' }),
    body: z.string({ message: '[SCHEMA ERROR] - Missing Field' }),
    tags: z.array(z.object({
        title: z.string({ message: '[SCHEMA ERROR] - Missing Field' })
    }))
});

export { createRequestSchema };