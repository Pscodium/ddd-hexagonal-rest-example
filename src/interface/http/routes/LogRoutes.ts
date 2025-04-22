/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Router } from 'express';
import Dependencies from '@/types/Dependencies';

export class LogRoutes {
    private router: any;
    private logsController: Dependencies['logsController'];
    private authenticationMiddleware: Dependencies['authenticationMiddleware'];

    constructor({ logsController, authenticationMiddleware }: Pick<Dependencies, 'logsController' | 'authenticationMiddleware'>) {
        this.logsController = logsController;
        this.authenticationMiddleware = authenticationMiddleware;
        this.router = Router();
    }

    public init(): Router {
        this.router.get('/logs/get', this.authenticationMiddleware.validate, this.logsController.get);
        this.router.get('/logs/get/format', this.authenticationMiddleware.validate , this.logsController.getWithFormat);

        return this.router;
    }

}