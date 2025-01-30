/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Router } from 'express';
import Dependencies from '@/types/Dependencies';


export class UserRoutes {
    private router: any;
    private userController: Dependencies['userController'];
    private authenticationMiddleware: Dependencies['authenticationMiddleware'];

    constructor({ userController, authenticationMiddleware }: Pick<Dependencies, 'userController' | 'authenticationMiddleware'>) {
        this.userController = userController;
        this.authenticationMiddleware = authenticationMiddleware;
        this.router = Router();
    }
    public init(): Router {
        this.router.post('/register', this.userController.create);
        this.router.post('/login', this.userController.login);
        this.router.post('/electron/login', this.userController.unexpiredLogin);
        this.router.get('/electron/logout', this.authenticationMiddleware.validate, this.userController.unexpiredLogout);
        this.router.get('/check/auth', this.authenticationMiddleware.validate, this.userController.check);
        this.router.get('/logout', this.authenticationMiddleware.validate, this.userController.logout);
        this.router.get('/data/user', this.authenticationMiddleware.validate, this.userController.getUserData);
        this.router.get('/users', this.authenticationMiddleware.validate, this.userController.findAll);
        this.router.get('/user/:id', this.authenticationMiddleware.validate, this.userController.findOne);

        return this.router;
    }
}
