import { AppError } from '@/shared/errors/AppError';
import Dependencies from '@/types/Dependencies';
import S3 from 'aws-sdk/clients/s3';

export class StorageS3Client {
    public client: S3;
    private environment: Dependencies['environment'];
    constructor({ environment }: Pick<Dependencies, 'environment'>) {
        this.environment = environment;
        this.client = this.instanceClient();
    }


    private instanceClient(): S3 {
        const callName = `${this.constructor.name}.${this.instanceClient.name}()`;
        try {
            const envPath = this.environment.integration.storage.providers.storage;
            const client = new S3({
                endpoint: envPath.endpoint,
                apiVersion: 'latest',
                region: envPath.region,
                accessKeyId: envPath.accessKeyId,
                secretAccessKey: envPath.secretAccessKey,
                signatureVersion: envPath.signatureVersion,
                s3ForcePathStyle: true
            });
    
            return client;
        } catch (err) {
            throw new AppError(`Error on ${callName} \nStack: ${err}`, 500);
        }
    }

    public getClient(): S3 {
        return this.client;
    }
}