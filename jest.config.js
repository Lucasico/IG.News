module.exports = {
    //pastas a serem ignoradas nos testes
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],
    //arquivos que o jest vai executar antes de iniciar os testes
    setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
    //transformando ts em js pelo babel-jest, pois o jest entende apenas js
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest'
    },

    testEnvironment: 'jsdom',

    //ignorando arquivos css e scss module, observar como deve ser no react sem nexts
    moduleNameMapper: {
        '\\.(scss|css|sass)$': 'identity-obj-proxy'
    }
};
