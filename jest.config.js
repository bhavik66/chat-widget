export default {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
  
    moduleNameMapper: {
      "\\.(css|less|sass|scss)$": "identity-obj-proxy",
      "^.+\\.svg$": "jest-transformer-svg",
      "^@/(.*)$": "<rootDir>/src/$1",
    },
  
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }], // Moved ts-jest config here
    },
};