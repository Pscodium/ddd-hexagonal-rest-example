declare namespace Express {
    export interface Request {
        userId?: string;
        user?: import('@/domain/entities/User').User;
        master_admin_level?: boolean;
    }
}