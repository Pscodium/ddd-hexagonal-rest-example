/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ITagEntity } from '@/types/entity/TagEntity';
import { DataTypes, Model, Sequelize, UUIDV4 } from 'sequelize';
import { SequelizeTagModel } from './SequelizeTagModel';

export class SequelizeArticleModel extends Model {
    public id!: string;
    public title!: string;
    public body!: string;
    public files!: string[];
    public private!: boolean;
    public UserId!: string;
    public Tags!: ITagEntity;
    public setTags!: (tags: any[]) => unknown;

    public static associate(models: any) {
        this.belongsTo(models.User, {
            as: 'User',
            foreignKey: 'UserId',
            onDelete: 'CASCADE'
        });
        this.belongsToMany(models.Tag, {
            as: 'Tags',
            through: 'article_tags',
            foreignKey: 'ArticleId',
            timestamps: true,
            onDelete: 'CASCADE'
        });
    }
}

export const initSequelizeArticleModel = (sequelize: Sequelize) => {
    SequelizeArticleModel.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            body: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            files: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            private: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
        },
        {
            sequelize: sequelize,
            tableName: 'article',
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            hooks: {
                async afterDestroy(article, options) {
                    const tags = await (article as any).Tags;

                    for (const tag of tags) {
                        await SequelizeTagModel.update({ count: sequelize.literal('count - 1')}, { where: { id: tag.id }});
                    }
                },
            }
        }
    );
};