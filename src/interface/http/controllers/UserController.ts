import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';
import { IPermissionEntity } from '@/types/entity/PermissionEntity';
import { IUserEntity } from '@/types/entity/UserEntity';
import { Request, Response } from 'express';

interface IUserController {
    create(req: Request, res: Response): Promise<Response>;
    findOne(req: Request, res: Response): Promise<Response>;
    findAll(req: Request, res: Response): Promise<Response>;
    login(req: Request, res: Response): Promise<Response>;
    check(req: Request, res: Response): Promise<Response>;
    unexpiredLogin(req: Request, res: Response): Promise<Response>;
    unexpiredLogout(req: Request, res: Response): Promise<Response>;
    logout(req: Request, res: Response): Promise<Response>;
    getUserData(req: Request, res: Response): Promise<Response>;
    delete(req: Request, res: Response): Promise<Response>;
    updatePerms(req: Request, res: Response): Promise<Response>;
    update(req: Request, res: Response): Promise<Response>;
}

export class UserController implements IUserController {
    private createUserUseCase: Dependencies['createUserUseCase'];
    private findOneUserUseCase: Dependencies['findOneUserUseCase'];
    private findAllUserUseCase: Dependencies['findAllUserUseCase'];
    private loginUserUseCase: Dependencies['loginUserUseCase'];
    private unexpiredLoginUseCase: Dependencies['unexpiredLoginUseCase'];
    private deleteUserUseCase: Dependencies['deleteUserUseCase'];
    private updatePermissionUseCase: Dependencies['updatePermissionUseCase'];
    private updateUserUseCase: Dependencies['updateUserUseCase'];
    private authorizationRequestService: Dependencies['authorizationRequestService'];
    private environment: Dependencies['environment'];
    private logger: Dependencies['logger'];

    constructor({
        createUserUseCase,
        findOneUserUseCase,
        findAllUserUseCase,
        loginUserUseCase,
        unexpiredLoginUseCase,
        deleteUserUseCase,
        updatePermissionUseCase,
        updateUserUseCase,
        authorizationRequestService,
        environment,
        logger,
    }: Pick<
        Dependencies,
        | 'createUserUseCase'
        | 'findOneUserUseCase'
        | 'findAllUserUseCase'
        | 'loginUserUseCase'
        | 'unexpiredLoginUseCase'
        | 'deleteUserUseCase'
        | 'updatePermissionUseCase'
        | 'updateUserUseCase'
        | 'authorizationRequestService'
        | 'environment'
        | 'logger'
    >) {
        this.createUserUseCase = createUserUseCase;
        this.findOneUserUseCase = findOneUserUseCase;
        this.findAllUserUseCase = findAllUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
        this.unexpiredLoginUseCase = unexpiredLoginUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
        this.updatePermissionUseCase = updatePermissionUseCase;
        this.updateUserUseCase = updateUserUseCase;

        this.authorizationRequestService = authorizationRequestService;
        this.environment = environment;
        this.logger = logger;
    }

    public create = async (req: Request, res: Response): Promise<Response> => {
        const callName = `${this.constructor.name}.create()`;
        try {
            const data = req.body;

            const user = await this.createUserUseCase.execute(data);

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
            const data = req.body;
            data.origin = origin;
            
            const user = await this.loginUserUseCase.execute(data, res);

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
            res.clearCookie('token', {
                domain: this.environment.frontend_domain,
                sameSite: 'none',
                secure: true,
                path: '/',
            });

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

    public getUserData = async (req: Request, res: Response): Promise<Response> => {
        const callName = `${this.constructor.name}.getUserData()`;
        try {
            if (!req.user) {
                throw new AppError('User not found', 404);
            }

            return res.status(200).json(req.user);
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

    public findAll = async (req: Request, res: Response): Promise<Response> => {
        const callName = `${this.constructor.name}.findAll()`;
        try {
            const users = await this.findAllUserUseCase.execute();

            return res.status(200).json(users);
        } catch (err) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(
                    `[REQUEST ERROR] - ${err.message}`,
                );
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[REQUEST ERROR] - Bad Request` });
        }
    };

    public unexpiredLogin = async (req: Request, res: Response): Promise<Response> => {
        const callName = `${this.constructor.name}.unexpiredLogin()`;
        try {
            const { login, password } = req.body;

            const user = await this.unexpiredLoginUseCase.execute(
                { login, password },
                res,
            );

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

    public unexpiredLogout = async (req: Request, res: Response): Promise<Response> => {
        const callName = `${this.constructor.name}.unexpiredLogout()`;
        try {
            const sessionDeleted = await this.authorizationRequestService.logout(req, res);

            return sessionDeleted ?
                res.status(200).json({ success: true }) :
                res.status(404).json({ message: "Unexpected error on delete session." });
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

    public logout = async (req: Request, res: Response): Promise<Response> => {
        const callName = `${this.constructor.name}.unexpiredLogout()`;
        try {
            const sessionDeleted = await this.authorizationRequestService.logout(req, res);

            return sessionDeleted ?
                res.status(200).json({ success: true }) :
                res.status(404).json({ message: "Unexpected error on delete session." });
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

    public delete = async(req: Request, res: Response): Promise<Response> => {
        const callName = `${this.constructor.name}.delete()`;
        try {
            const { id } = req.params;

            if (!id) {
                this.logger.error(
                    `[REQUEST ERROR] - Missing required route parameter 'id'`,
                );
                return res.status(400).json({
                    message: "[REQUEST ERROR] - Missing required route parameter 'id'"
                });
            }

            await this.deleteUserUseCase.execute(id);

            return res.status(200).json({ success: true });
        } catch (err) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(
                    `[REQUEST ERROR] - ${err.message}`,
                );
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[REQUEST ERROR] - Bad Request` });
        }
    };

    public updatePerms = async(req: Request, res: Response): Promise<Response> => {
        const callName = `${this.constructor.name}.updatePerms()`;
        try {
            const id = req.params.id;
            const permissions: IPermissionEntity = req.body;
            permissions.userId = id;
            
            if (!id) {
                this.logger.error(
                    `[REQUEST ERROR] - Missing required route parameter 'id'`,
                );
                return res.status(400).json({
                    message: "[REQUEST ERROR] - Missing required route parameter 'id'"
                });
            }

            const updated = await this.updatePermissionUseCase.execute(permissions);

            if (updated == 0) {
                this.logger.warn(
                    `[REQUEST WARN] - Permissions have not been changed`,
                );
                return res.status(400).json("[REQUEST WARN] - Permissions have not been changed");
            }

            return res.status(200).json({ success: true });
        } catch (err) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(
                    `[REQUEST ERROR] - ${err.message}`,
                );
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[REQUEST ERROR] - Bad Request` });
        }
    };

    public update = async(req: Request, res: Response): Promise<Response> => {
        const callName = `${this.constructor.name}.update()`;
        try {
            const user: IUserEntity = req.body;
            user.id = req.userId;

            const updated = await this.updateUserUseCase.execute(user);

            if (updated == 0) {
                this.logger.warn(
                    `[REQUEST WARN] - Permissions have not been changed`,
                );
                return res.status(400).json("[REQUEST WARN] - Permissions have not been changed");
            }

            return res.status(200).json({ success: true });
        } catch (err) {
            if (err instanceof AppError) {
                console.error(
                    JSON.stringify({
                        message: `[REQUEST ERROR] - ${callName}`,
                        stack: err.stack,
                    }),
                );
                this.logger.error(
                    `[REQUEST ERROR] - ${err.message}`,
                );
                return res.status(err.status).json({ message: err.stack });
            }

            return res
                .status(500)
                .json({ stack: `[REQUEST ERROR] - Bad Request` });
        }
    };
}
