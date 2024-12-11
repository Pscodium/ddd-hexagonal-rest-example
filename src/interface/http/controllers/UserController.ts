import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { CreateUserUseCase } from '@/app/useCases/user/Create';

@injectable()
export class UserController {
    constructor(
        @inject('CreateUserUseCase') private createUserUseCase: CreateUserUseCase
    ) {}

    async create(req: Request, res: Response): Promise<Response> {
        const callName = `${this.constructor.name}.${this.create.name}()`;
        try {
            const { name, email } = req.body;

            const user = await this.createUserUseCase.execute({ name, email });

            return res.status(200).json(user);
        } catch (err) {
            console.error(`[REQUEST ERRROR] - ${callName}`);
            return res.status(500).json({message: `[REQUEST ERRROR] - ${callName}`});
        }  
    }
}
