import { AppError } from "@/shared/errors/AppError";
import Dependencies from "@/types/Dependencies";
import { NextFunction, Request, Response } from "express";


export class AuthenticationMiddleware {
    private authorizationRequestService: Dependencies['authorizationRequestService'];
    private logger: Dependencies['logger'];

    constructor({ authorizationRequestService, logger }: Pick<Dependencies, 'authorizationRequestService' | 'logger'>) {
        this.authorizationRequestService = authorizationRequestService;
        this.logger = logger;
    }

    validate = async(req: Request, res: Response, next: NextFunction): Promise<NextFunction | Response | void> => {
        const callName = `${this.constructor.name}.${this.validate.name}()`;
        try {
            let token: string = '';
            const { authorization, cookie } = req.headers;
            
            if (!authorization && !cookie) {
                throw new AppError('You need to provides a authorization token.', 403);
            }

            if (cookie) {
                token = cookie.replace('token=', '');
            }

            if (authorization) {
                token = authorization.replace('Bearer', '').trim();
            }
            
            const session = await this.authorizationRequestService.validateSession(token);
            const user = await this.authorizationRequestService.getAuthenticatedUser(session.userId);

            delete user.password;
            user.token = token;
            
            req.userId = user.id;
            req.user = user;

            return next();
            
        } catch (err) {
            if (err instanceof AppError) {
                console.error(JSON.stringify({ 
                    message: `[MIDDLEWARE ERROR] - ${callName}`, 
                    stack: err.stack 
                }));
                this.logger.error(`[MIDDLEWARE ERROR] - ${err.message}`); // TODO: Centralizar logs apenas na instancia do erro deles
                return res.status(err.status).json({ message: err.stack });
            }

            return res.status(500).json({ stack: `[MIDDLEWARE ERROR] - Bad Request`, error: err });   
        };
    };

}