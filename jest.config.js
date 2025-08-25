module.exports = {
    preset: 'ts-jest',
    testEnvironment: '<rootDir>/tests/jest-mysql-environment.ts',
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
    }
};