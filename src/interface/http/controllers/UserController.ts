import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';

export class UserController {
    private createUserUseCase: Dependencies['createUserUseCase'];
    private findOneUserUseCase: Dependencies['findOneUserUseCase'];
    private loginUserUseCase: Dependencies['loginUserUseCase'];
    private logger: Dependencies['logger'];

    constructor({ createUserUseCase, findOneUserUseCase, loginUserUseCase, logger }: Pick<Dependencies, 'createUserUseCase' | 'findOneUserUseCase' | 'loginUserUseCase' | 'logger'>) {
        this.createUserUseCase = createUserUseCase;
        this.findOneUserUseCase = findOneUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
        this.logger = logger;
    }

    async create(req: Request, res: Response): Promise<Response> {
        const callName = `${this.constructor.name}.${this.create.name}()`;
        try {
            const { firstName, lastName, nickname, email, password } = req.body;

            const user = await this.createUserUseCase.execute({ firstName, lastName, nickname, password, email });

            return res.status(200).json(user);
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(JSON.stringify({ 
                    message: `[REQUEST ERROR] - ${callName}`, 
                    stack: err.stack 
                }));
                this.logger.error(`[REQUEST ERROR] - ${err.message}`);
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
                this.logger.error(`[REQUEST ERROR] - ${err.message}`);
                return res.status(err.status).json({ message: err.stack });
            }

            return res.status(500).json({ stack: `[REQUEST ERROR] - Bad Request` });   
        }  
    }

    async login(req: Request, res: Response): Promise<Response> {
        const callName = `${this.constructor.name}.${this.login.name}()`;
        try {
            const { origin } = req.headers;
            const { nickname, email, password } = req.body;
            
            const user = await this.loginUserUseCase.execute({ nickname, email, password, origin }, res);

            return res.status(200).json(user);
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(JSON.stringify({ 
                    message: `[REQUEST ERROR] - ${callName}`, 
                    stack: err.stack 
                }));
                this.logger.error(`[REQUEST ERROR] - ${err.message}`);
                return res.status(err.status).json({ message: err.stack });
            }

            return res.status(500).json({ stack: `[REQUEST ERROR] - Bad Request` });   
        }
    }
}
