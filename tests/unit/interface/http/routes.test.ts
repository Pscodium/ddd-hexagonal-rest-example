import container from "@/config/container";

describe("HTTP Routes", () => {
    it("should resolve the user router", () => {
        const userRoutes = container.resolve("userRoutes");
        expect(userRoutes).toBeDefined();
    });

    it("should resolve the article router", () => {
        const articleRoutes = container.resolve("articleRoutes");
        expect(articleRoutes).toBeDefined();
    });

    it("should resolve the log router", () => {
        const logRoutes = container.resolve("logRoutes");
        expect(logRoutes).toBeDefined();
    });

    it("should resolve the storage router", () => {
        const storageRoutes = container.resolve("storageRoutes");
        expect(storageRoutes).toBeDefined();
    });
});
