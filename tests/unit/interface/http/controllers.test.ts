/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { container } from "../../../setupTests";
import Dependencies from "@/types/Dependencies";

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

describe("HTTP Controllers", () => {
    it("should resolve the user controller and return error on request", async () => {
        const userController: Dependencies['userController'] = container.resolve("userController");
        const response: any = await userController.findAll(req, res);
        expect(userController).toBeDefined();
        expect(response.statusCode).toBe(200);
        expect([]).toEqual(response.data);
    });

    it("should resolve the article controller and return error on request", async () => {
        const articleController: Dependencies['articleController'] = container.resolve("articleController");
        const response: any = await articleController.getArticles(req, res);
        console.log('response ', response);
        expect(articleController).toBeDefined();
        expect(response.statusCode).toBe(200);
        expect([]).toEqual(response.data);
    });

    it("should resolve the log controller and return empty array", async () => {
        const logController: Dependencies['logsController'] = container.resolve("logsController");
        const response: any = await logController.get(req, res);
        expect(logController).toBeDefined();
        expect(response.statusCode).toBe(200);
        expect([]).toEqual(response.hits.hits);
    });

    it("should resolve the storage controller", async () => {
        const storageController: Dependencies['storageController'] = container.resolve("storageController");
        const response: any = await storageController.getFiles(req, res);
        expect(storageController).toBeDefined();
        expect(response.statusCode).toBe(200);
        expect([]).toEqual(response.data);
    });
});
