import { z } from "zod";
import { regex } from '@/shared/utils/Regex';


const updateRequestSchema = z.object({
    firstName: z.string({ message: '[SCHEMA ERROR] - Missing Field' }).optional(),
    lastName: z.string({ message: '[SCHEMA ERROR] - Missing Field' }).optional(),
    nickname: z.string({ message: '[SCHEMA ERROR] - Missing Field' }).optional(),
    profileIcon: z.string({ message: '[SCHEMA ERROR] - Missing Field' }).optional(),
    email: z.string({ message: '[SCHEMA ERROR] - Missing Field' }).regex(regex.schema.EMAIL_REGEX, '[REGEX ERROR] - Invalid field regex').optional(),
});

export { updateRequestSchema };