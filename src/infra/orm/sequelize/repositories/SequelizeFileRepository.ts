/* eslint-disable @typescript-eslint/no-explicit-any */
import { File } from "@/domain/entities/File";
import { IFileRepository } from "@/domain/repositories/IFileRepository";
import { SequelizeFileModel } from "../models/SequelizeFileModel";
import { SequelizeFolderModel } from "../models/SequelizeFolderModel";
import { AppError } from "@/shared/errors/AppError";
import Dependencies from "@/types/Dependencies";


export class SequelizeFileRepository implements IFileRepository {
    private sequelize: Dependencies['sequelize'];
    private sequelizeAdapter: Dependencies['sequelizeAdapter'];

    constructor({ sequelizeAdapter }: Pick<Dependencies, 'sequelizeAdapter'>) {
        this.sequelizeAdapter = sequelizeAdapter;
        this.sequelize = this.sequelizeAdapter.getConnection();
    }

    async create(data: Partial<File>): Promise<File | null> {
        const file = await SequelizeFileModel.create({
            name: data.name,
            url: data.url,
            UserId: data.UserId,
            type: data.type,
            FolderId: data.FolderId
        });

        return file ? new File(file) : null;
    }

    async associateWithFolder(fileId: string, folderId: string): Promise<void> {
        const file = await SequelizeFileModel.findByPk(fileId);
        const folder = await SequelizeFolderModel.findByPk(folderId);

        if (!file || !folder) {
            throw new AppError("File or Folder not found!!", 404);
        }

        await (folder as any).addFile(file);
    }

    async findOne(fileId: string): Promise<File | null> {
        const file = await SequelizeFileModel.findByPk(fileId);

        return file ? new File(file) : null;
    }

    async delete(fileId: string): Promise<void> {
        await SequelizeFileModel.destroy({
            where: {
                id: fileId
            }
        });
    }

    async findAll(): Promise<File[]> {
        const files = await SequelizeFileModel.findAll({
            order: [['createdAt', 'DESC']]
        });
        return files.map((f: any) => new File(f));
    }

    async hasFileOnFolder(folderId: string, fileId: string): Promise<boolean> {
        const file = await SequelizeFileModel.findOne({
            where: {
                FolderId: folderId,
                id: fileId
            }
        });
        return !!file;
    }
}