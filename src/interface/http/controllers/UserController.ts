import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/shared/types/dependencies';

@injectable()
export class UserController {
    constructor(
        @inject('CreateUserUseCase') private createUserUseCase: Dependencies['CreateUserUseCase'],
        @inject('FindOneUserUseCase') private findOneUserUseCase: Dependencies['FindOneUserUseCase']
    ) {}

    async create(req: Request, res: Response): Promise<Response> {
        const callName = `${this.constructor.name}.${this.create.name}()`;
        try {
            const { name, email } = req.body;

            const user = await this.createUserUseCase.execute({ name, email });

            return res.status(200).json(user);
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

    async findOne(req: Request, res: Response): Promise<Response> {
        const callName = `${this.constructor.name}.${this.findOne.name}()`;
        try {
            const { id } = req.params;

            const user = await this.findOneUserUseCase.execute(id);

            return res.status(200).json(user);
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
