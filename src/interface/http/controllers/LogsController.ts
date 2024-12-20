import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';

export class LogsController {
    private getLogsUseCase: Dependencies['getLogsUseCase'];
    private getLogsFormattedUseCase: Dependencies['getLogsFormattedUseCase'];
    private logger: Dependencies['logger'];

    constructor({ getLogsUseCase, getLogsFormattedUseCase, logger }: Pick<Dependencies, 'getLogsUseCase' | 'getLogsFormattedUseCase' | 'logger'>) {
        this.getLogsUseCase = getLogsUseCase;
        this.getLogsFormattedUseCase = getLogsFormattedUseCase;
        this.logger = logger;
    }

    public get = async (req: Request, res: Response): Promise<Response> => {
        console.log(`aqui `, req.user);
        const callName = `${this.constructor.name}.get()`;
        try {
            const logs = await this.getLogsUseCase.execute();

            return res.status(200).json(logs);
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(JSON.stringify({ 
                    message: `[REQUEST ERROR] - ${callName}`, 
                    stack: err.stack 
                }));
                this.logger.error(`[REQUEST ERROR] - ${err.message}`); // TODO: Centralizar logs apenas na instancia do erro deles
                return res.status(err.status).json({ message: err.stack });
            }

            return res.status(500).json({ stack: `[REQUEST ERROR] - Bad Request` });   
        } 
    };

    public getWithFormat = async (req: Request, res: Response): Promise<Response> => {
        const callName = `${this.constructor.name}.getWithFormat()`;
        try {
            const logs = await this.getLogsFormattedUseCase.execute();

            return res.status(200).json(logs);
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(JSON.stringify({ 
                    message: `[REQUEST ERROR] - ${callName}`, 
                    stack: err.stack 
                }));
                this.logger.error(`[REQUEST ERROR] - ${err.message}`);  // TODO: Centralizar logs apenas na instancia do erro deles
                return res.status(err.status).json({ message: err.stack });
            }

            return res.status(500).json({ stack: `[REQUEST ERROR] - Bad Request` });   
        } 
    };

}
