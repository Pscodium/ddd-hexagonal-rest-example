/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Router } from 'express';
import Dependencies from '@/types/Dependencies';
import { updatePermissionSchema } from '@/domain/schemas/user/UpdatePermissionRequestSchema';
import { loginRequestSchema, registerRequestSchema } from '@/domain/schemas/user/AuthenticationRequestSchema';

export class UserRoutes {
    private router: any;
    private userController: Dependencies['userController'];
    private authenticationMiddleware: Dependencies['authenticationMiddleware'];
    private schemaMiddleware: Dependencies['schemaMiddleware'];
    private enums: Dependencies['enums'];

    constructor({ userController, authenticationMiddleware, schemaMiddleware, enums }: Pick<Dependencies, 'userController' | 'authenticationMiddleware' | 'schemaMiddleware' | 'enums'>) {
        this.userController = userController;
        this.authenticationMiddleware = authenticationMiddleware;
        this.schemaMiddleware = schemaMiddleware;
        this.enums = enums;
        this.router = Router();
    }
    public init(): Router {

        // Authentication routes
        this.router.post('/register', this.schemaMiddleware.loadSchema(registerRequestSchema), this.userController.create);
        this.router.post('/login', this.schemaMiddleware.loadSchema(loginRequestSchema), this.userController.login);
        this.router.post('/electron/login', this.schemaMiddleware.loadSchema(loginRequestSchema), this.userController.unexpiredLogin);
        this.router.get('/electron/logout', this.authenticationMiddleware.validate, this.userController.unexpiredLogout);
        this.router.get('/check/auth', this.authenticationMiddleware.validate, this.userController.check);
        this.router.get('/logout', this.authenticationMiddleware.validate, this.userController.logout);
        this.router.get('/data/user', this.authenticationMiddleware.validate, this.userController.getUserData);

        // User routes
        this.router.get('/users', this.authenticationMiddleware.validate, this.userController.findAll);
        this.router.get('/user/:id', this.authenticationMiddleware.validate, this.userController.findOne);
        this.router.delete('/user/:id', this.authenticationMiddleware.validate, this.authenticationMiddleware.hasPermissions([this.enums.Permissions.MASTER_ADMIN_LEVEL]), this.userController.delete);
        this.router.put('/user/:id/update/perms', this.authenticationMiddleware.validate, this.authenticationMiddleware.hasPermissions([this.enums.Permissions.MASTER_ADMIN_LEVEL]), this.schemaMiddleware.loadSchema(updatePermissionSchema), this.userController.updatePerms);

        return this.router;
    }
}
