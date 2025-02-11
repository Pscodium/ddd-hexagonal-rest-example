import Dependencies from '@/types/Dependencies';
import { Request, Response, NextFunction } from 'express';
import z from 'zod';

export default class SchemaMiddleware {
    private logger: Dependencies['logger'];
    constructor({ logger }: Pick<Dependencies, 'logger'>) {
        this.logger = logger;
    };

    loadSchema(schema: z.ZodSchema) {
        return (req: Request, res: Response, next: NextFunction): NextFunction | Response | undefined => {
            const parsedBody = schema.safeParse(req.body);

            if (!parsedBody.success) {
                return res.status(400).json({
                    message: "Invalid data",
                    details: parsedBody.error.format()
                });
            }

            req.body = parsedBody.data;

            next();
        };
    }

}