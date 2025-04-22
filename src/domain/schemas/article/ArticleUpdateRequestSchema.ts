import { z } from "zod";

const updateRequestSchema = z.object({
    title: z.string({ message: '[SCHEMA ERROR] - Missing Field' }),
    body: z.string({ message: '[SCHEMA ERROR] - Missing Field' }),
    tags: z.array(z.object({
        title: z.string({ message: '[SCHEMA ERROR] - Missing Field' })
    }))
});

export { updateRequestSchema };