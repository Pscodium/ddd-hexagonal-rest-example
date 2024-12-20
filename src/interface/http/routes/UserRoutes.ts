/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Router } from 'express';
import Dependencies from '@/types/Dependencies';


export class UserRoutes {
    private router: any;
    private userController: Dependencies['userController'];

    constructor({ userController }: Pick<Dependencies, 'userController'>) {
        this.userController = userController;
        this.router = Router();
    }
    public init(): Router {
        this.router.post('/register', this.userController.create);
        this.router.get('/user/:id', this.userController.findOne);
        this.router.post('/user/login', this.userController.login);

        return this.router;
    }
}
