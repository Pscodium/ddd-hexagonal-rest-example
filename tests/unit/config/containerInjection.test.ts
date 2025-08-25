import container from '@/config/container/index';

describe('Dependency Injection Example', () => {
    it('should resolve App instance from container and call start()', async () => {
        const environment = container.resolve('environment');
        expect(environment).toBeDefined();
    });

    it('should resolve a registered dependency (logger)', () => {
        const logger = container.resolve('logger');
        expect(logger).toBeDefined();
    });
});
