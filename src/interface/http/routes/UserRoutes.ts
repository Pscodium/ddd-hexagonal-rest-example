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
        this.router.post('/user/login', this.userController.login);
        this.router.get('/user/:id', this.authenticationMiddleware.validate, this.userController.findOne);
        this.router.get('/check/auth', this.authenticationMiddleware.validate, this.userController.check);

        return this.router;
    }
}
