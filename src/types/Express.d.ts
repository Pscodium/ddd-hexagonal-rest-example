declare namespace Express {
    export interface Request {
        userId: string | undefined;
        user: import("@/domain/entities/User").User | undefined;
        master_admin_level: boolean | undefined;
    }
}