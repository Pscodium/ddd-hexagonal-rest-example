/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock global File object for test environment
global.File = function () {} as any;
(global.File as any).prototype = {};

import container from "@/config/container";
import { Session } from "@/domain/entities/Session";
import { User } from "@/domain/entities/User";
import { AppError } from "@/shared/errors/AppError";
import Dependencies from "@/types/Dependencies";

let user: User;
let session: Session;

const req = jest.fn() as any;
const res = {
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


describe('HTTP Services', () => {

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

    it('should return success on validate session', async () => {
        const authorizationRequestService: Dependencies['authorizationRequestService'] = container.resolve("authorizationRequestService");
        const response = await authorizationRequestService.validateSession(session.sessionId ?? '');
        
        expect(response).toBeInstanceOf(Session);
        expect(new Date(response.expirationDate).getDate()).toEqual(new Date(session.expirationDate).getDate());
        expect(response.jwt).toEqual(session.jwt);
        expect(response.origin).toEqual(session.origin);
        expect(response.sessionId).toEqual(session.sessionId);
        expect(response.userId).toEqual(session.userId);
    });

    it('should throw error on validate session', async () => {
        const authorizationRequestService: Dependencies['authorizationRequestService'] = container.resolve("authorizationRequestService");
        try {
            await authorizationRequestService.validateSession('fake-user-id');
        } catch (error: any) {
            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Invalid SessionId');
            expect(error.status).toBe(401);
        }
    });

    it('should return success on user authentication', async () => {
        const authorizationRequestService: Dependencies['authorizationRequestService'] = container.resolve("authorizationRequestService");
        const response = await authorizationRequestService.getAuthenticatedUser(user.id);

        expect(response).toBeInstanceOf(User);
        expect(response).toEqual(user);
    });

    it('should throw error on get authenticated user', async () => {
        const authorizationRequestService: Dependencies['authorizationRequestService'] = container.resolve("authorizationRequestService");
        try {
            await authorizationRequestService.getAuthenticatedUser('fake-user-id');
        } catch (error: any) {
            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Invalid user id.');
            expect(error.status).toBe(401);
        }
    });

    it('should return check auth with success', async () => {
        const authorizationRequestService: Dependencies['authorizationRequestService'] = container.resolve("authorizationRequestService");
        req.user = { id: 'valid-user-id' }; // Simulate a valid user in the request
        const user = await authorizationRequestService.checkAuth(req, res);
        expect(user).toBeDefined();
        expect(user.id).toBe('valid-user-id');
    });

    it('should throw error checking auth', async () => {
        const authorizationRequestService: Dependencies['authorizationRequestService'] = container.resolve("authorizationRequestService");
        try {
            await authorizationRequestService.checkAuth(req, res);
        } catch (error: any) {
            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('User is not authorized');
            expect(error.status).toBe(401);
        }
    });

    it('should logout return false', async () => {
        const authorizationRequestService: Dependencies['authorizationRequestService'] = container.resolve("authorizationRequestService");
        req.user = { token: 'invalid-token' };
        const success = await authorizationRequestService.logout(req, res);
        expect(success).toBe(false);
    });

    it('should logout return true', async () => {
        const authorizationRequestService: Dependencies['authorizationRequestService'] = container.resolve("authorizationRequestService");
        req.user = { token: session.sessionId };
        const success = await authorizationRequestService.logout(req, res);
        expect(success).toBe(true);
    });

    afterAll(async () => {
        const sequelizeAdapter = container.resolve("sequelizeAdapter");
        if (sequelizeAdapter && typeof sequelizeAdapter.cleanDatabase === "function") {
            await sequelizeAdapter.cleanDatabase();
        }
    });
});