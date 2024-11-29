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
    "^.+\\.tsx?$": "ts-jest", // Para arquivos .ts e .tsx
    "^.+\\.[t|j]sx?$": "babel-jest", // Para arquivos JS/TSX com Babel
  },
  transformIgnorePatterns: [
    "/node_modules/(?!@nanostores).+\\.js$", // Permite a transformação de @nanostores
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true, // Ativa a coleta de cobertura
  coverageDirectory: "coverage", // Diretório para salvar os relatórios
  coverageReporters: ["lcov", "text", "html"], // Relatórios em LCOV e texto
};

module.exports = createJestConfig(customJestConfig);
