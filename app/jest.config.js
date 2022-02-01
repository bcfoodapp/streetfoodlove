module.exports = {
  globals: {
    "ts-jest": {
      tsconfig: {
        module: "esnext",
        target: "es2021",
        sourceMap: true,
        lib: ["dom", "es2020"],
        jsx: "react-jsx",
        moduleResolution: "node",
        allowSyntheticDefaultImports: true,
        strict: true,
        noImplicitAny: false,
        skipLibCheck: true,
        esModuleInterop: true,
      },
    },
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
  },
  testRegex: "src/__tests__/.*\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testEnvironment: "jsdom",
};
