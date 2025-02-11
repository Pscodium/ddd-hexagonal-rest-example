import { z } from "zod";
import { regex } from '@/shared/utils/Regex';

const loginRequestSchema = z.object({
    login: z.string(),
    password: z.string()
});

const registerRequestSchema = z.object({
    firstName: z.string({ message: '[SCHEMA ERROR] - Missing Field' }),
    lastName: z.string({ message: '[SCHEMA ERROR] - Missing Field' }),
    nickname: z.string({ message: '[SCHEMA ERROR] - Missing Field' }),
    password: z.string({ message: '[SCHEMA ERROR] - Missing Field' }).regex(regex.schema.PASSWORD_REGEX, '[REGEX ERROR] - Invalid field regex'),
    email: z.string({ message: '[SCHEMA ERROR] - Missing Field' }).regex(regex.schema.EMAIL_REGEX, '[REGEX ERROR] - Invalid field regex'),
});

export { loginRequestSchema, registerRequestSchema };