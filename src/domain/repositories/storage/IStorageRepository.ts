import { AWSError, S3 } from "aws-sdk";
import { DeleteObjectOutput } from "aws-sdk/clients/s3";
import { PromiseResult } from "aws-sdk/lib/request";

export interface IStorageRepository {
    uploadFile(fileName: string, content: Buffer | S3.Body, folderName?: string): Promise<string>;
    deleteFile(fileName: string, folderName?: string): Promise<PromiseResult<DeleteObjectOutput, AWSError>>;
    createFolder(folderName: string): Promise<void>;
    deleteFolder(folderName: string): Promise<void>;
};