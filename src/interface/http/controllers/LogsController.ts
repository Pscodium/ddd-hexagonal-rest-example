import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';

export class LogsController {
    private getLogsUseCase: Dependencies['getLogsUseCase'];
    private getLogsFormattedUseCase: Dependencies['getLogsFormattedUseCase'];

    constructor({ getLogsUseCase, getLogsFormattedUseCase }: Pick<Dependencies, 'getLogsUseCase' | 'getLogsFormattedUseCase'>) {
        this.getLogsUseCase = getLogsUseCase;
        this.getLogsFormattedUseCase = getLogsFormattedUseCase;
    }

    async get(req: Request, res: Response): Promise<Response> {
        const callName = `${this.constructor.name}.${this.get.name}()`;
        try {
            const logs = await this.getLogsUseCase.execute();

            return res.status(200).json(logs);
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(JSON.stringify({ 
                    message: `[REQUEST ERROR] - ${callName}`, 
                    stack: err.stack 
                }));
                return res.status(err.status).json({ message: err.stack });
            }

            return res.status(500).json({ stack: `[REQUEST ERROR] - Bad Request` });   
        } 
    }

    async getWithFormat(req: Request, res: Response): Promise<Response> {
        const callName = `${this.constructor.name}.${this.getWithFormat.name}()`;
        try {
            const logs = await this.getLogsFormattedUseCase.execute();

            return res.status(200).json(logs);
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(JSON.stringify({ 
                    message: `[REQUEST ERROR] - ${callName}`, 
                    stack: err.stack 
                }));
                return res.status(err.status).json({ message: err.stack });
            }

            return res.status(500).json({ stack: `[REQUEST ERROR] - Bad Request` });   
        } 
    }

}