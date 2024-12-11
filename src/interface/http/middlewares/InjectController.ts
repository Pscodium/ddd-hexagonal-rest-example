/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Request, Response, NextFunction } from 'express';
import { AwilixContainer } from 'awilix';

/**
 * Middleware para injetar dependências no controlador.
 * @param Controller Classe do controlador que será resolvida pelo contêiner.
 * @param method Método do controlador que será executado.
 */
export const injectController = (controllerName: string, method: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const container: AwilixContainer = req.app.locals.container;
            const controller = container.resolve(controllerName);

            await controller[method](req, res);
        } catch (err) {
            next(err);
        }
    };
};