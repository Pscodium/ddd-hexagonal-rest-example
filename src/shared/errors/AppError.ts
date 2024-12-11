export class AppError extends Error {
    public status: number;
    constructor(message: string, statusCode: number) {
        super();
        this.message = message;
        this.stack = `[ERROR](${statusCode}) - ${message}`;
        this.status = statusCode;
    }
}