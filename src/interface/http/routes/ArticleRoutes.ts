/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Router } from 'express';
import Dependencies from '@/types/Dependencies';
import { createRequestSchema } from '@/domain/schemas/article/ArticleCreateResquestSchema';
import { updateRequestSchema } from '@/domain/schemas/article/ArticleUpdateRequestSchema';

export class ArticleRoutes {
    private router: any;
    private articleController: Dependencies['articleController'];
    private authenticationMiddleware: Dependencies['authenticationMiddleware'];
    private schemaMiddleware: Dependencies['schemaMiddleware'];
    private enums: Dependencies['enums'];

    constructor({
        articleController,
        authenticationMiddleware,
        schemaMiddleware,
        enums,
    }: Pick<
        Dependencies,
        | 'articleController'
        | 'authenticationMiddleware'
        | 'schemaMiddleware'
        | 'enums'
    >) {
        this.articleController = articleController;
        this.authenticationMiddleware = authenticationMiddleware;
        this.schemaMiddleware = schemaMiddleware;
        this.enums = enums;
        this.router = Router();
    }

    public init(): Router {
        this.router.post(
            '/article/create',
            this.authenticationMiddleware.validate,
            this.authenticationMiddleware.hasPermissions([
                this.enums.Permissions.MASTER_ADMIN_LEVEL,
                this.enums.Permissions.CAN_POST_ARTICLE,
            ]),
            this.schemaMiddleware.loadSchema(createRequestSchema),
            this.articleController.create,
        );
        this.router.get(
            '/articles',
            this.articleController.getArticles,
        );
        this.router.get(
            '/tags',
            this.articleController.getTags,
        );
        this.router.get(
            '/articles/tag/:id',
            this.articleController.getArticlesByTagId,
        );
        this.router.put(
            '/article/update/:id',
            this.authenticationMiddleware.validate,
            this.authenticationMiddleware.hasPermissions([
                this.enums.Permissions.MASTER_ADMIN_LEVEL,
                this.enums.Permissions.CAN_POST_ARTICLE,
            ]),
            this.schemaMiddleware.loadSchema(updateRequestSchema),
            this.articleController.update,
        );
        this.router.delete(
            '/article/delete/:id',
            this.authenticationMiddleware.validate,
            this.authenticationMiddleware.hasPermissions([
                this.enums.Permissions.MASTER_ADMIN_LEVEL,
                this.enums.Permissions.CAN_POST_ARTICLE,
            ]),
            this.articleController.deleteArticle
        );
        this.router.delete(
            '/tag/delete/:id',
            this.authenticationMiddleware.validate,
            this.authenticationMiddleware.hasPermissions([
                this.enums.Permissions.MASTER_ADMIN_LEVEL,
                this.enums.Permissions.CAN_POST_ARTICLE,
            ]),
            this.articleController.deleteTag
        );

        return this.router;
    }
}
