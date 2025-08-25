/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { container } from "../../../setupTests";
import Dependencies from "@/types/Dependencies";

let user: Dependencies['user'];
let session: Dependencies['session'];
let req: any;
let res: any;
let next: any;

describe("HTTP Middlewares", () => {

    beforeEach(() => {
        req = jest.fn() as any;
        res = {
            status: jest.fn((status) => {
                return {
                    status,
                    json: jest.fn((message) => {
                        if (Array.isArray(message)) {
                            return { statusCode: status, data: message };
                        }
                        message.statusCode = status;
                        return message;
                    })
                };
            }),
            clearCookie: jest.fn((_arg, cb) => {
                if (typeof cb === 'function') cb();
            }),
        } as any;
        next = jest.fn(() => ({ success: true })) as any;
    });

    beforeAll(async () => {
        const userRepository: Dependencies['userRepository'] = await container.resolve("userRepository");
        const sessionRepository: Dependencies['sessionRepository'] = await container.resolve("sessionRepository");
    
        user = await userRepository.save({
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            nickname: 'johndoe',
            password: 'Qwe1234@'
        });
    
        session = await sessionRepository.create({
            userId: user.id,
            expirationDate: new Date(Date.now() + 3600000).getTime(),
            jwt: null,
            origin: 'localhost',
        });
    });

    it("should return success on validate token", async () => {
        const authenticationMiddleware: Dependencies['authenticationMiddleware'] = container.resolve("authenticationMiddleware");
        req.headers = { cookie: `token=${session.sessionId}`};
        const response: any = await authenticationMiddleware.validate(req, res, next);
        expect(response.success).toEqual(true);
        expect(req.userId).toEqual(user.id);
        expect(req.master_admin_level).toEqual(user.Permission?.master_admin_level);
        user.token = session.sessionId;
        expect(req.user).toEqual(user);
    });

    it("should return error on validate token", async () => {
        const authenticationMiddleware: Dependencies['authenticationMiddleware'] = container.resolve("authenticationMiddleware");
        req.headers = { cookie: `token=invalid_token` };
        const response: any = await authenticationMiddleware.validate(req, res, next);
        expect(response.statusCode).toEqual(401);
        expect(response.message).toEqual('[ERROR](401) - Invalid SessionId');
        expect(req.userId).toBeUndefined();
        expect(req.master_admin_level).toBeUndefined();
        expect(req.user).toBeUndefined();
    });

    it("should return error on validate permission", async () => {
        const authenticationMiddleware: Dependencies['authenticationMiddleware'] = container.resolve("authenticationMiddleware");
        req.headers = { cookie: `token=${session.sessionId}`};
        const response: any = await authenticationMiddleware.validate(req, res, next);
        expect(response.success).toEqual(true);

        delete req.headers.cookie;
        const enums: Dependencies['enums'] = container.resolve("enums");
        const middleware = authenticationMiddleware.hasPermissions([enums.Permissions.MASTER_ADMIN_LEVEL]);

        res.status = jest.fn().mockReturnValue({
            json: jest.fn()
        });

        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.status().json).toHaveBeenCalledWith({
            message: "[ERROR](403) - You don't have permissions for use this route."
        });
    });

    it("should return succes on validate permission", async () => {
        const authenticationMiddleware: Dependencies['authenticationMiddleware'] = container.resolve("authenticationMiddleware");
        const permissionRepository: Dependencies['permissionRepository'] = await container.resolve("permissionRepository");
        await permissionRepository.updateUserPermission({ userId: user.id, master_admin_level: true });

        req.headers = { cookie: `token=${session.sessionId}`};
        const response: any = await authenticationMiddleware.validate(req, res, next);
        expect(response.success).toEqual(true);

        delete req.headers.cookie;
        const enums: Dependencies['enums'] = container.resolve("enums");
        const middleware = authenticationMiddleware.hasPermissions([enums.Permissions.MASTER_ADMIN_LEVEL]);


        await middleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it("should return success on validate schema", async () => {
        const inicialBody = {
            title: 'Example Title',
            body: 'Example Body',
        };
        const exampleSchema = z.object({
            title: z.string({ message: '[SCHEMA ERROR] - Missing Field' }),
            body: z.string({ message: '[SCHEMA ERROR] - Missing Field' }),
        });
        req.body = inicialBody;
        const schemaMiddleware: Dependencies['schemaMiddleware'] = container.resolve("schemaMiddleware");
        const middleware = schemaMiddleware.loadSchema(exampleSchema);

        await middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.body).toEqual(inicialBody);
    });

    it("should return error on validate schema", async () => {
        const inicialBody = {
            title: 'Example Title'
        };
        const exampleSchema = z.object({
            title: z.string({ message: '[SCHEMA ERROR] - Missing Field' }),
            body: z.string({ message: '[SCHEMA ERROR] - Missing Field' }),
        });
        req.body = inicialBody;
        const schemaMiddleware: Dependencies['schemaMiddleware'] = container.resolve("schemaMiddleware");
        const middleware = schemaMiddleware.loadSchema(exampleSchema);

        res.status = jest.fn().mockReturnValue({
            json: jest.fn()
        });

        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.status().json).toHaveBeenCalledWith({
            details: {
                body: "[SCHEMA ERROR] - Missing Field",
            },
            message: "[SCHEMA VALIDATOR ERROR] - Invalid data"
        });
    });

    it("should validate schema and clean invalid fields", async () => {
        const validBody = {
            title: 'Example Title',
            body: 'Example Body'
        };
        const invalidBody = {
            title: 'Example Title',
            body: 'Example Body',
            invalidField: 'Invalid field value'
        };

        const exampleSchema = z.object({
            title: z.string({ message: '[SCHEMA ERROR] - Missing Field' }),
            body: z.string({ message: '[SCHEMA ERROR] - Missing Field' }),
        });
        req.body = invalidBody;

        const schemaMiddleware: Dependencies['schemaMiddleware'] = container.resolve("schemaMiddleware");
        const middleware = schemaMiddleware.loadSchema(exampleSchema);

        res.status = jest.fn().mockReturnValue({
            json: jest.fn()
        });

        await middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.body).toEqual(validBody);
    });
});
