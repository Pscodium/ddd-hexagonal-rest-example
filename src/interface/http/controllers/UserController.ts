import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';
import { Request, Response } from 'express';

export class UserController {
    private createUserUseCase: Dependencies['createUserUseCase'];
    private findOneUserUseCase: Dependencies['findOneUserUseCase'];
    private loginUserUseCase: Dependencies['loginUserUseCase'];
    private authorizationRequestService: Dependencies['authorizationRequestService'];
    private logger: Dependencies['logger'];

    constructor({
        createUserUseCase,
        findOneUserUseCase,
        loginUserUseCase,
        authorizationRequestService,
        logger,
    }: Pick<
        Dependencies,
        | 'createUserUseCase'
        | 'findOneUserUseCase'
        | 'loginUserUseCase'
        | 'authorizationRequestService'
        | 'logger'
    >) {
        this.createUserUseCase = createUserUseCase;
        this.findOneUserUseCase = findOneUserUseCase;
        this.loginUserUseCase = loginUserUseCase;

        this.authorizationRequestService = authorizationRequestService;
        this.logger = logger;
    }

    public create = async (req: Request, res: Response): Promise<Response> => {
        const callName = `${this.constructor.name}.create()`;
        try {
            const { firstName, lastName, nickname, email, password } = req.body;

            const user = await this.createUserUseCase.execute({
                firstName,
                lastName,
                nickname,
                password,
                email,
            });

            return res.status(200).json(user);
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(`[REQUEST ERROR] - ${err.message}`); // TODO: Centralizar logs apenas na instancia do erro deles
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[REQUEST ERROR] - Bad Request` });
        }
    };

    public findOne = async (req: Request, res: Response): Promise<Response> => {
        const callName = `${this.constructor.name}.findOne()`;
        try {
            const { id } = req.params;

            const user = await this.findOneUserUseCase.execute(id);

            return res.status(200).json(user);
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(`[REQUEST ERROR] - ${err.message}`); // TODO: Centralizar logs apenas na instancia do erro deles
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[REQUEST ERROR] - Bad Request` });
        }
    };

    public login = async (req: Request, res: Response): Promise<Response> => {
        const callName = `${this.constructor.name}.login()`;
        try {
            const { origin } = req.headers;
            const { nickname, email, password } = req.body;

            const user = await this.loginUserUseCase.execute(
                { nickname, email, password, origin },
                res,
            );

            return res.status(200).json(user);
        } catch (err: unknown) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(`[REQUEST ERROR] - ${err.message}`); // TODO: Centralizar logs apenas na instancia do erro deles
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[REQUEST ERROR] - Bad Request` });
        }
    };

    public check = async (req: Request, res: Response): Promise<Response> => {
        const callName = `${this.constructor.name}.check()`;
        try {
            const user = await this.authorizationRequestService.checkAuth(req, res);

            return res.status(200).json(user);
        } catch (err) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(
                    `[AUTHORIZATION REQUEST ERROR] - ${err.message}`,
                );
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[AUTHORIZATION REQUEST ERROR] - Bad Request` });
        }
    };
}
