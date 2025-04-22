/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { IArticleEntity } from '@/types/entity/ArticleEntity';
import { DataTypes, Model, Sequelize, UUIDV4 } from 'sequelize';

export class SequelizeTagModel extends Model {
    public id!: string;
    public title!: string;
    public count!: number;
    public views!: number;
    public hex!: string;
    public UserId!: string;
    public Articles!: IArticleEntity[];
    public addArticle!: (article: IArticleEntity) => unknown;
    public removeArticle!: (articleId: string) => unknown;

    public static associate(models: any) {
        this.belongsTo(models.User, {
            as: 'User',
            foreignKey: 'UserId',
            onDelete: 'CASCADE'
        });
        this.belongsToMany(models.Article, {
            as: 'Articles',
            through: 'article_tags',
            foreignKey: 'TagId',
            timestamps: true,
            onDelete: 'CASCADE'
        });
    }
}

export const initSequelizeTagModel = (sequelize: Sequelize) => {
    SequelizeTagModel.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            count: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            views: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: true,
            },
            hex: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: "#000000"
            },
        },
        {
            sequelize: sequelize,
            tableName: 'tag',
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        }
    );
};