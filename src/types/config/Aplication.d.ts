export type IAllowedOrigins = string[]; 

export interface IOptions {
    origin: IAllowedOrigins;
    credentials: boolean;
}