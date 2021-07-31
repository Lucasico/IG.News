module.exports = {
    //pastas a serem ignoradas nos testes
    testIgnorePatterns: ['/node_modules/', '/.next/'],
    //arquivos que o jest vai executar antes de iniciar os testes
    setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
    //transformando ts em js pelo babel-jest, pois o jest entende apenas js
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest'
    },
    testEnvironment: 'jsdom'
};
