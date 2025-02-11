/* eslint-disable @typescript-eslint/no-explicit-any */
import Dependencies from '@/types/Dependencies';
import { Request, Response, NextFunction } from 'express';
import z from 'zod';

type FormattedSchemaError = {
    [key: string]: string[]
}

export default class SchemaMiddleware {
    private logger: Dependencies['logger'];
    constructor({ logger }: Pick<Dependencies, 'logger'>) {
        this.logger = logger;
    };

    loadSchema(schema: z.ZodSchema) {
        return (req: Request, res: Response, next: NextFunction): NextFunction | Response | undefined => {
            const parsedBody = schema.safeParse(req.body);

            if (!parsedBody.success) {
                const responseError = {
                    message: '[SCHEMA VALIDATOR ERROR] - Invalid data',
                    details: {}
                };
                const formattedErrors: FormattedSchemaError = parsedBody.error.format();
                const errorObj: { [key: string]: string | unknown | undefined } = {};
                Object.keys(formattedErrors).forEach(key => {
                    const formattedError = formattedErrors[key];
                    if (formattedError && '_errors' in formattedError) {
                        errorObj[key] = (formattedError as { _errors: unknown[] })._errors[0];
                    }
                });
                responseError.details = errorObj;
                this.logger.error(JSON.stringify(responseError));
                return res.status(400).json(responseError);
            }

            req.body = parsedBody.data;

            next();
        };
    }

}