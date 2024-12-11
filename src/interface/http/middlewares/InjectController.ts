/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { container, InjectionToken } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para injetar dependências no controlador.
 * @param Controller Classe do controlador que será resolvida pelo container.
 * @param method Método do controlador que será executado.
 */
export const injectController =
    (Controller: InjectionToken<any>, method: keyof any) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const controllerInstance = container.resolve(Controller);

                await controllerInstance[method](req, res);
            } catch (err) {
                console.log('entra aqui também');
                next(err);
            }
        };