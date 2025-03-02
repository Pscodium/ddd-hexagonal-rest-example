import { IStorageRepository } from "@/domain/repositories/storage/IStorageRepository";
import { AppError } from "@/shared/errors/AppError";
import Dependencies from "@/types/Dependencies";
import { AWSError } from "aws-sdk";
import { Body, DeleteObjectOutput } from "aws-sdk/clients/s3";
import { PromiseResult } from "aws-sdk/lib/request";


export class StorageRepository implements IStorageRepository {
    private storageClient: Dependencies['storageClient'];
    private environment: Dependencies['environment'];
    private logger: Dependencies['logger'];
    private client: Dependencies['storageType'];
    constructor({ storageClient, environment, logger }: Pick<Dependencies, 'storageClient' | 'environment' | 'logger'>) {
        this.storageClient = storageClient;
        this.environment = environment;
        this.logger = logger;
        this.client = this.storageClient.getClient();
    }

    async uploadFile(fileName: string, content: Buffer | Body, folderName?: string): Promise<string> {
        try {
            const { Location } = await this.client.upload({
                Bucket: this.environment.integration.storage.providers.storage.bucket,
                Key: `${folderName}${fileName}`,
                Body: content
            }).promise();

            return Location;
        } catch (err) {
            this.logger.error(`Unexpected error creating file on S3 - stack: ${err} `);
            throw new AppError(`Unexpected error creating file on S3 - stack: ${err} `, 500);
        }
    }

    async deleteFile(fileName: string, folderName = ''): Promise<PromiseResult<DeleteObjectOutput, AWSError>> {
        try {
            return await this.client.deleteObject({
                Bucket: this.environment.integration.storage.providers.storage.bucket,
                Key: `${folderName}${fileName}`
            }).promise();
        } catch (err) {
            this.logger.error(`Unexpected error deleting file on S3 - stack: ${err} `);
            throw new AppError(`Unexpected error deleting file on S3 - stack: ${err} `, 500);
        }
    }

    async createFolder(folderName: string): Promise<void> {
        try {
            const params = {
                Bucket: this.environment.integration.storage.providers.storage.bucket,
                Key: folderName,
                Body: '',
            };

            await this.client.putObject(params).promise();
            this.logger.info(`Folder created: ${folderName}`);
        } catch (err) {
            this.logger.error(`Unexpected error creating folder on S3 - stack: ${err} `);
            throw new AppError(`Unexpected error creating folder on S3 - stack: ${err} `, 500);
        }
    }

    async deleteFolder(folderName: string): Promise<void> {
        try {
            
            const listedObjects = await this.client.listObjectsV2({
                Bucket: this.environment.integration.storage.providers.storage.bucket,
                Prefix: folderName
            }).promise();

            if (listedObjects.Contents && listedObjects.Contents.length > 0) {
                const deleteParams = {
                    Bucket: this.environment.integration.storage.providers.storage.bucket,
                    Delete: { Objects: [] }
                };

                listedObjects.Contents.forEach(({ Key }) => {
                    deleteParams.Delete.Objects.push({ Key } as never);
                });

                await this.client.deleteObjects(deleteParams).promise();
            }

            await this.client.deleteObject({
                Bucket: this.environment.integration.storage.providers.storage.bucket,
                Key: folderName
            }).promise();

            this.logger.info(`Deleted folder: ${folderName}`);
        } catch (err) {
            this.logger.error(`Unexpected error deleting folder on S3 - stack: ${err}`);
            throw new AppError(`Unexpected error deleting folder on S3 - stack: ${err} `, 500);
        }
    }
    
}