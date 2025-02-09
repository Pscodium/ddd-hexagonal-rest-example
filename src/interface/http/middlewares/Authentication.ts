import { AppError } from "@/shared/errors/AppError";
import Dependencies from "@/types/Dependencies";
import { PermissionsValuesType } from "@/types/Enums";
import { NextFunction, Request, Response } from "express";


export class AuthenticationMiddleware {
    private authorizationRequestService: Dependencies['authorizationRequestService'];
    private permissionRequestService: Dependencies['permissionRequestService'];
    private logger: Dependencies['logger'];

    constructor({ authorizationRequestService, permissionRequestService, logger }: Pick<Dependencies, 'authorizationRequestService' | 'permissionRequestService' | 'logger'>) {
        this.authorizationRequestService = authorizationRequestService;
        this.permissionRequestService = permissionRequestService;
        this.logger = logger;
    }

    validate = async(req: Request, res: Response, next: NextFunction): Promise<NextFunction | Response | void> => {
        const callName = `${this.constructor.name}.${this.validate.name}()`;
        try {
            let token: string = '';
            const { authorization, cookie } = req.headers;
            
            if (!authorization && !cookie) {
                throw new AppError('You need to provides a authorization token.', 401);
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
            req.master_admin_level = user.Permission?.master_admin_level;

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
    
    hasPermissions(permissions: PermissionsValuesType[]): (req: Request, res: Response, next: NextFunction) => void {
        const callName = `${this.constructor.name}.${this.hasPermissions.name}()`;
        return async(req: Request, res: Response, next: NextFunction) => {
            if (!req.userId) {
                throw new AppError('User is not autorized', 403);
            } else if (req.master_admin_level) {
                return next();
            }
            try { 
                const hasPermission = await this.permissionRequestService.hasPermission(req.userId, permissions);
                if (hasPermission) {
                    return next();
                }
                throw new AppError("You don't have permissions for use this route.", 403);
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
            }
            
        };
    }
}