const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./", // Diretório da aplicação Next.js
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg|ico|bmp|tiff)$": "<rootDir>/__mocks__/fileMock.js",
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest", // Usa SWC para testes
  },
  transformIgnorePatterns: [
    "/node_modules/(?!@nanostores).+\\.js$", // Permite a transformação de @nanostores
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true, // Ativa a coleta de cobertura
  coverageDirectory: "coverage", // Diretório para salvar os relatórios
  coverageReporters: ["lcov", "text", "html"], // Relatórios em LCOV, texto e HTML
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)", // Testes na pasta __tests__
    "**/?(*.)+(spec|test).[tj]s?(x)", // Testes com .spec ou .test
  ],
  roots: ["<rootDir>/"], // Busca testes na raiz do projeto
};

module.exports = createJestConfig(customJestConfig);
