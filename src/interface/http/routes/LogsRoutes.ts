/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Router } from 'express';
import Dependencies from '@/types/Dependencies';

export class LogRoutes {
    private router: any;
    private logsController: Dependencies['logsController'];

    constructor({ logsController }: Pick<Dependencies, 'logsController'>) {
        this.logsController = logsController;
        this.router = Router();
    }

    public init(): Router {
        this.router.get('/logs/get', this.logsController.get);
        this.router.get('/logs/get/format', this.logsController.getWithFormat);

        return this.router;
    }

}